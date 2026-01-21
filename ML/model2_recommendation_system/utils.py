"""
Utility functions for data loading and processing.
"""

import json
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class KnowledgeBaseLoader:
    """Loads and caches knowledge base JSON files."""
    
    _roles_cache: Optional[Dict[str, Any]] = None
    _courses_cache: Optional[Dict[str, Any]] = None
    _projects_cache: Optional[Dict[str, Any]] = None
    
    @staticmethod
    def load_roles(path: str = "knowledge_base/roles.json") -> Dict[str, Any]:
        """Load roles knowledge base."""
        if KnowledgeBaseLoader._roles_cache is None:
            try:
                with open(path, 'r') as f:
                    KnowledgeBaseLoader._roles_cache = json.load(f)
                logger.info(f"Loaded roles from {path}")
            except FileNotFoundError:
                logger.error(f"Roles file not found: {path}")
                raise
        return KnowledgeBaseLoader._roles_cache
    
    @staticmethod
    def load_courses(path: str = "knowledge_base/courses.json") -> List[Dict[str, Any]]:
        """Load courses knowledge base."""
        if KnowledgeBaseLoader._courses_cache is None:
            try:
                with open(path, 'r') as f:
                    data = json.load(f)
                    KnowledgeBaseLoader._courses_cache = data.get('courses', [])
                logger.info(f"Loaded {len(KnowledgeBaseLoader._courses_cache)} courses from {path}")
            except FileNotFoundError:
                logger.error(f"Courses file not found: {path}")
                raise
        return KnowledgeBaseLoader._courses_cache
    
    @staticmethod
    def load_projects(path: str = "knowledge_base/projects.json") -> List[Dict[str, Any]]:
        """Load projects knowledge base."""
        if KnowledgeBaseLoader._projects_cache is None:
            try:
                with open(path, 'r') as f:
                    data = json.load(f)
                    KnowledgeBaseLoader._projects_cache = data.get('projects', [])
                logger.info(f"Loaded {len(KnowledgeBaseLoader._projects_cache)} projects from {path}")
            except FileNotFoundError:
                logger.error(f"Projects file not found: {path}")
                raise
        return KnowledgeBaseLoader._projects_cache
    
    @staticmethod
    def clear_cache():
        """Clear all caches."""
        KnowledgeBaseLoader._roles_cache = None
        KnowledgeBaseLoader._courses_cache = None
        KnowledgeBaseLoader._projects_cache = None


def get_role_domain(role_id: str, roles_data: Dict[str, Any]) -> Optional[str]:
    """Get the domain for a specific role."""
    for sector_key, sector_data in roles_data.get('sectors', {}).items():
        if role_id in sector_data.get('roles', {}):
            return sector_data.get('sector_name', '').replace(' / ', ' / ')
    return None


def get_role_profile(role_id: str, sector: str, roles_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Get full role profile. Supports lookup by role_id or role_name."""
    sectors = {
        'healthcare_technology': 'healthcare_technology',
        'agricultural_sciences': 'agricultural_sciences',
        'urban_smart_city': 'urban_smart_city',
    }
    
    sector_key = sectors.get(sector.lower())
    if not sector_key:
        return None
    
    sector_data = roles_data.get('sectors', {}).get(sector_key, {})
    roles = sector_data.get('roles', {})
    
    # First try exact match on role_id
    if role_id in roles:
        return roles[role_id]
    
    # Try to find by normalizing the role_id
    normalized_role_id = role_id.lower().replace(' ', '_').replace('-', '_')
    if normalized_role_id in roles:
        return roles[normalized_role_id]
    
    # Try to find by role_name
    for rid, role_data in roles.items():
        role_name = role_data.get('role_name', '').lower().replace(' ', '_').replace('-', '_')
        if role_name == normalized_role_id:
            return role_data
    
    # Try fuzzy match - find best partial match
    for rid, role_data in roles.items():
        # Check if input contains key words from role_id
        if normalized_role_id in rid or rid in normalized_role_id:
            return role_data
    
    # Last resort - return "other" role if available
    other_key = f"other_{sector_key.split('_')[0]}_role"
    if other_key in roles:
        return roles[other_key]
    
    return None


def filter_courses_by_domain(courses: List[Dict[str, Any]], domain: str) -> List[Dict[str, Any]]:
    """Filter courses to only those in the specified domain."""
    return [c for c in courses if c.get('domain') == domain]


def filter_projects_by_domain(projects: List[Dict[str, Any]], domain: str) -> List[Dict[str, Any]]:
    """Filter projects to only those in the specified domain."""
    return [p for p in projects if p.get('domain') == domain]


def filter_by_role(courses: List[Dict[str, Any]], role_id: str) -> List[Dict[str, Any]]:
    """Filter courses that map to the given role."""
    return [c for c in courses if role_id in c.get('mapped_roles', [])]


def filter_by_role_projects(projects: List[Dict[str, Any]], role_id: str) -> List[Dict[str, Any]]:
    """Filter projects that map to the given role."""
    return [p for p in projects if role_id in p.get('mapped_roles', [])]


def filter_out_completed(
    items: List[Dict[str, Any]],
    completed_ids: List[str],
    id_field: str = 'course_id'
) -> List[Dict[str, Any]]:
    """Remove items that have been completed."""
    completed_set = set(completed_ids)
    return [item for item in items if item.get(id_field) not in completed_set]


def extract_completed_course_ids(courses_names: List[str]) -> List[str]:
    """Extract course IDs from course names if they follow the pattern."""
    ids = []
    for name in courses_names:
        # Try to extract ID-like patterns (e.g., "HC-101")
        if '-' in name and len(name.split('-')) == 2:
            ids.append(name)
    return ids


def calculate_difficulty_match_score(
    user_difficulty_levels: List[str],
    course_difficulty: str
) -> float:
    """Score how well course difficulty matches user's experience."""
    difficulty_order = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}
    
    if course_difficulty not in difficulty_order:
        return 0.5
    
    course_level = difficulty_order[course_difficulty]
    
    # Best match if course difficulty is in user's capable levels
    if course_difficulty in user_difficulty_levels:
        return 1.0
    
    # Check if course is slightly harder (good for growth)
    if course_level > 0 and difficulty_order.get(user_difficulty_levels[-1] if user_difficulty_levels else None, -1) >= course_level - 1:
        return 0.7
    
    # Otherwise lower score
    return 0.3


def get_user_difficulty_levels(education_level: str) -> List[str]:
    """Get recommended difficulty levels based on education."""
    difficulty_map = {
        'high_school': ['Beginner', 'Intermediate'],
        'diploma': ['Beginner', 'Intermediate'],
        'bachelors': ['Intermediate', 'Advanced'],
        'masters': ['Advanced'],
        'phd': ['Advanced'],
    }
    return difficulty_map.get(education_level.lower(), ['Beginner'])


def normalize_domain_name(domain: str) -> str:
    """Normalize domain names for consistent comparison."""
    domain_mapping = {
        'healthcare_technology': 'Healthcare Technology',
        'agricultural_sciences': 'Agricultural Sciences',
        'urban_smart_city': 'Urban / Smart City Planning',
    }
    
    # Try direct mapping
    if domain.lower() in domain_mapping:
        return domain_mapping[domain.lower()]
    
    # If already in full form, return as-is
    if domain in domain_mapping.values():
        return domain
    
    return domain
