import api from './api';

/**
 * Dashboard Service
 * Handles dashboard data fetching including ML recommendations
 */
const dashboardService = {
  /**
   * Get complete dashboard summary including ML data
   * @returns {Promise} - DashboardSummaryResponse
   */
  getSummary: async () => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  },

  /**
   * Get dashboard data (alias for getSummary for backward compatibility)
   * @returns {Promise} - DashboardSummaryResponse
   */
  getDashboard: async () => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  },

  /**
   * Get course recommendations (separate endpoint if needed)
   * @returns {Promise} - CourseRecommendationResponse
   */
  getCourseRecommendations: async () => {
    const response = await api.get('/api/recommendations/courses');
    return response.data;
  },

  /**
   * Get project recommendations (separate endpoint if needed)
   * @returns {Promise} - ProjectRecommendationResponse
   */
  getProjectRecommendations: async () => {
    const response = await api.get('/api/recommendations/projects');
    return response.data;
  },

  /**
   * Get skill gap analysis
   * @returns {Promise} - SkillGapAnalysisResponse
   */
  getSkillGapAnalysis: async () => {
    const response = await api.get('/api/analytics/skill-gaps');
    return response.data;
  },

  /**
   * Extract ML recommendations from dashboard data
   * @param {Object} dashboardData - DashboardSummaryResponse
   * @returns {Object} - ML recommendations and predictions
   */
  extractMLData: (dashboardData) => {
    console.log('[dashboardService] extractMLData called with:', dashboardData);
    
    const externalData = dashboardData?.externalApiData || {};
    console.log('[dashboardService] externalApiData:', externalData);
    
    const skillPrediction = externalData.skillPrediction || {};
    const recommendations = externalData.recommendations || {};
    
    console.log('[dashboardService] skillPrediction:', skillPrediction);
    console.log('[dashboardService] recommendations:', recommendations);
    
    // Extract skill names from the recommendedSkills objects
    // Handle both snake_case (from ML API via backend) and camelCase formats
    const rawSkills = skillPrediction.recommendedSkills || skillPrediction.recommended_skills || [];
    const skillNames = rawSkills.map(s => typeof s === 'string' ? s : s.skill).filter(Boolean);
    
    // Handle both snake_case and camelCase property names from backend
    const skillGapScore = skillPrediction.skillGapScore ?? skillPrediction.skill_gap_score ?? null;
    const timeToReadyMonths = skillPrediction.timeToReadyMonths ?? skillPrediction.time_to_ready_months ?? null;
    
    console.log('[dashboardService] Extracted skillGapScore:', skillGapScore, 'from', skillPrediction);
    console.log('[dashboardService] Extracted timeToReadyMonths:', timeToReadyMonths);
    
    // Extract and normalize course recommendations (handle snake_case from backend)
    const rawCourses = recommendations.recommendedCourses || recommendations.recommended_courses || [];
    const normalizedCourses = rawCourses.map(course => ({
      id: course.courseId || course.course_id,
      name: course.title,
      title: course.title,
      domain: course.domain,
      difficulty: course.difficulty,
      duration: course.durationWeeks ? `${course.durationWeeks} weeks` : (course.duration_weeks ? `${course.duration_weeks} weeks` : null),
      durationWeeks: course.durationWeeks || course.duration_weeks,
      skills: course.skillsCovered || course.skills_covered || [],
      explanation: course.explanation,
      youtubeLink: course.youtubeLink || course.youtube_link,
    }));
    
    // Extract and normalize project recommendations (handle snake_case from backend)
    const rawProjects = recommendations.recommendedProjects || recommendations.recommended_projects || [];
    const normalizedProjects = rawProjects.map(project => ({
      id: project.projectId || project.project_id,
      name: project.title,
      title: project.title,
      domain: project.domain,
      difficulty: project.difficulty,
      complexity: project.complexity,
      duration: project.durationWeeks ? `${project.durationWeeks} weeks` : (project.duration_weeks ? `${project.duration_weeks} weeks` : null),
      durationWeeks: project.durationWeeks || project.duration_weeks,
      skills: project.skillsRequired || project.skills_required || [],
      technologies: project.skillsRequired || project.skills_required || [],
      description: project.explanation,
      explanation: project.explanation,
      youtubeLink: project.youtubeLink || project.youtube_link,
    }));
    
    return {
      // Course recommendations from ML API
      recommendedCourses: normalizedCourses,
      
      // Project recommendations from ML API  
      recommendedProjects: normalizedProjects,
      
      // Skill predictions from ML API
      skillGapScore: skillGapScore,
      timeToReadyMonths: timeToReadyMonths,
      recommendedSkills: skillNames,
      recommendedSkillsWithConfidence: rawSkills,
      predictionStatus: skillPrediction.status || 'Unknown',
      
      // API call status
      apiStatus: {
        recommendationsSuccess: externalData.status?.recommendationsSuccess || false,
        skillPredictSuccess: externalData.status?.skillPredictSuccess || false,
        youtubeSuccess: externalData.status?.youtubeEnrichmentSuccess || false,
        errorMessage: externalData.status?.errorMessage || null,
      },
      
      // Additional reasoning from ML
      reasoning: recommendations.reasoning || '',
      generatedAt: recommendations.generatedAt || recommendations.generated_at || null,
    };
  },

  /**
   * Get sector theme based on user's industry sector
   * @param {string} sector - "Healthcare", "Agriculture", or "Urban"
   * @returns {Object} - Theme configuration
   */
  getSectorTheme: (sector) => {
    const themes = {
      Healthcare: {
        primary: 'blue-500',
        primaryHex: '#3B82F6',
        secondary: 'blue-100',
        gradient: 'from-blue-400 to-indigo-500',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        icon: 'Heart',
      },
      Agriculture: {
        primary: 'green-500',
        primaryHex: '#10B981',
        secondary: 'green-100',
        gradient: 'from-green-400 to-emerald-500',
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        icon: 'Sprout',
      },
      Urban: {
        primary: 'indigo-500',
        primaryHex: '#6366F1',
        secondary: 'indigo-100',
        gradient: 'from-indigo-400 to-purple-500',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        icon: 'Building2',
      },
    };
    
    return themes[sector] || themes.Healthcare;
  },
};

export default dashboardService;
