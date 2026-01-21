"""
Core recommendation engine implementing role-first filtering and rule-based shortlisting.
"""

from typing import Dict, List, Any, Tuple, Optional
import logging
from config import (
    ROLE_RELEVANCE_WEIGHT,
    DIFFICULTY_MATCH_WEIGHT,
    SKILL_COVERAGE_WEIGHT,
    EXPERIENCE_WEIGHT,
    DIFFICULTY_SCORES,
    COMPLEXITY_SCORES,
    MAX_COURSES_TO_SHORTLIST,
    MAX_PROJECTS_TO_SHORTLIST,
)
from utils import (
    KnowledgeBaseLoader,
    get_role_profile,
    normalize_domain_name,
    filter_courses_by_domain,
    filter_projects_by_domain,
    filter_by_role,
    filter_by_role_projects,
    filter_out_completed,
    get_user_difficulty_levels,
    calculate_difficulty_match_score,
)

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Role-centric recommendation engine with rule-based shortlisting.
    
    Flow:
    1. Load knowledge base
    2. Get target role profile (ROLE-FIRST)
    3. Filter by domain
    4. Filter by role relevance
    5. Exclude completed items
    6. Apply rule-based shortlisting
    7. Return top N items for LLM ranking
    """
    
    def __init__(self):
        """Initialize engine with knowledge base."""
        try:
            self.roles_db = KnowledgeBaseLoader.load_roles()
            self.courses_db = KnowledgeBaseLoader.load_courses()
            self.projects_db = KnowledgeBaseLoader.load_projects()
            logger.info("RecommendationEngine initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize RecommendationEngine: {e}")
            raise
    
    def shortlist_courses(
        self,
        target_sector: str,
        target_role: str,
        education_level: str,
        num_courses_completed: int,
        avg_course_grade: Optional[float],
        completed_course_ids: List[str],
    ) -> List[Dict[str, Any]]:
        """
        Rule-based shortlisting for courses.
        
        Priority:
        1. Role relevance (highest weight)
        2. Domain match
        3. Difficulty match with education level
        4. Exclude already completed
        5. Score and rank
        """
        
        logger.info(f"Shortlisting courses for role: {target_role}, sector: {target_sector}")
        
        # Step 1: Domain filtering (STRICT)
        domain_name = normalize_domain_name(target_sector)
        domain_courses = filter_courses_by_domain(self.courses_db, domain_name)
        logger.info(f"Found {len(domain_courses)} courses in domain '{domain_name}'")
        
        # Step 2: Role-specific filtering (HIGHEST PRIORITY)
        role_relevant_courses = filter_by_role(domain_courses, target_role)
        logger.info(f"Found {len(role_relevant_courses)} courses relevant to role '{target_role}'")
        
        # Step 3: Exclude completed courses
        available_courses = filter_out_completed(
            role_relevant_courses,
            completed_course_ids,
            id_field='course_id'
        )
        logger.info(f"After excluding completed: {len(available_courses)} courses available")
        
        # Step 4: Score and rank
        scored_courses = self._score_courses(
            available_courses,
            target_role,
            education_level,
            num_courses_completed,
            avg_course_grade
        )
        
        # Step 5: Return top N for LLM
        shortlist = sorted(
            scored_courses,
            key=lambda x: x['_score'],
            reverse=True
        )[:MAX_COURSES_TO_SHORTLIST]
        
        logger.info(f"Shortlisted {len(shortlist)} courses for LLM ranking")
        return shortlist
    
    def shortlist_projects(
        self,
        target_sector: str,
        target_role: str,
        education_level: str,
        num_projects_completed: int,
        completed_project_ids: List[str],
    ) -> List[Dict[str, Any]]:
        """
        Rule-based shortlisting for projects.
        
        Similar priority as courses, with complexity matching.
        """
        
        logger.info(f"Shortlisting projects for role: {target_role}, sector: {target_sector}")
        
        # Step 1: Domain filtering (STRICT)
        domain_name = normalize_domain_name(target_sector)
        domain_projects = filter_projects_by_domain(self.projects_db, domain_name)
        logger.info(f"Found {len(domain_projects)} projects in domain '{domain_name}'")
        
        # Step 2: Role-specific filtering (HIGHEST PRIORITY)
        role_relevant_projects = filter_by_role_projects(domain_projects, target_role)
        logger.info(f"Found {len(role_relevant_projects)} projects relevant to role '{target_role}'")
        
        # Step 3: Exclude completed projects
        available_projects = filter_out_completed(
            role_relevant_projects,
            completed_project_ids,
            id_field='project_id'
        )
        logger.info(f"After excluding completed: {len(available_projects)} projects available")
        
        # Step 4: Score and rank
        scored_projects = self._score_projects(
            available_projects,
            target_role,
            education_level,
            num_projects_completed
        )
        
        # Step 5: Return top N for LLM
        shortlist = sorted(
            scored_projects,
            key=lambda x: x['_score'],
            reverse=True
        )[:MAX_PROJECTS_TO_SHORTLIST]
        
        logger.info(f"Shortlisted {len(shortlist)} projects for LLM ranking")
        return shortlist
    
    def _score_courses(
        self,
        courses: List[Dict[str, Any]],
        target_role: str,
        education_level: str,
        num_courses_completed: int,
        avg_course_grade: Optional[float],
    ) -> List[Dict[str, Any]]:
        """Score courses based on role relevance and other factors."""
        
        user_difficulty_levels = get_user_difficulty_levels(education_level)
        
        for course in courses:
            # Role relevance score (highest weight)
            # All courses passed here are role-relevant, so base score is high
            role_score = 1.0
            
            # Difficulty match score
            difficulty = course.get('difficulty', 'Intermediate')
            difficulty_score = calculate_difficulty_match_score(user_difficulty_levels, difficulty)
            
            # Skill coverage score (based on course having relevant skills)
            skills = course.get('skills_covered', [])
            skill_score = min(1.0, len(skills) / 5.0) if skills else 0.3
            
            # Experience score (progression-based)
            if num_courses_completed == 0:
                experience_score = 0.8 if difficulty == 'Beginner' else 0.5
            elif num_courses_completed < 3:
                experience_score = 0.9 if difficulty in ['Beginner', 'Intermediate'] else 0.7
            else:
                experience_score = 1.0  # Advanced users can take any level
            
            # Combined weighted score
            total_score = (
                role_score * ROLE_RELEVANCE_WEIGHT +
                difficulty_score * DIFFICULTY_MATCH_WEIGHT +
                skill_score * SKILL_COVERAGE_WEIGHT +
                experience_score * EXPERIENCE_WEIGHT
            )
            
            course['_score'] = total_score
        
        return courses
    
    def _score_projects(
        self,
        projects: List[Dict[str, Any]],
        target_role: str,
        education_level: str,
        num_projects_completed: int,
    ) -> List[Dict[str, Any]]:
        """Score projects based on role relevance and complexity."""
        
        user_difficulty_levels = get_user_difficulty_levels(education_level)
        
        for project in projects:
            # Role relevance score (highest weight)
            role_score = 1.0
            
            # Difficulty match score
            difficulty = project.get('difficulty', 'Intermediate')
            difficulty_score = calculate_difficulty_match_score(user_difficulty_levels, difficulty)
            
            # Complexity consideration
            complexity = project.get('complexity', 'Medium')
            complexity_match_score = 1.0 if complexity == 'Medium' else 0.8
            
            # Skill requirements score
            skills = project.get('skills_required', [])
            skill_score = min(1.0, len(skills) / 6.0) if skills else 0.3
            
            # Experience progression score
            if num_projects_completed == 0:
                experience_score = 0.7 if difficulty == 'Intermediate' else 0.5
            elif num_projects_completed < 2:
                experience_score = 0.9
            else:
                experience_score = 1.0
            
            # Combined weighted score
            total_score = (
                role_score * ROLE_RELEVANCE_WEIGHT +
                difficulty_score * DIFFICULTY_MATCH_WEIGHT +
                skill_score * SKILL_COVERAGE_WEIGHT +
                experience_score * EXPERIENCE_WEIGHT
            )
            
            project['_score'] = total_score
        
        return projects
    
    def get_role_profile(self, target_role: str, target_sector: str) -> Optional[Dict[str, Any]]:
        """Retrieve the target role profile from knowledge base."""
        return get_role_profile(target_role, target_sector, self.roles_db)
    
    def generate_shortlist_for_llm(
        self,
        target_sector: str,
        target_role: str,
        education_level: str,
        num_courses_completed: int,
        avg_course_grade: Optional[float],
        completed_course_ids: List[str],
        num_projects_completed: int,
        completed_project_ids: List[str],
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Main entry point: shortlist courses and projects for LLM ranking.
        
        Returns: (shortlisted_courses, shortlisted_projects)
        """
        
        courses = self.shortlist_courses(
            target_sector=target_sector,
            target_role=target_role,
            education_level=education_level,
            num_courses_completed=num_courses_completed,
            avg_course_grade=avg_course_grade,
            completed_course_ids=completed_course_ids,
        )
        
        projects = self.shortlist_projects(
            target_sector=target_sector,
            target_role=target_role,
            education_level=education_level,
            num_projects_completed=num_projects_completed,
            completed_project_ids=completed_project_ids,
        )
        
        return courses, projects
