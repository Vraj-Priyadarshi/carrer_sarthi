import axios from 'axios';

/**
 * AI Insights Service
 * Handles communication with Model-3 (Career Intelligence API)
 * This service calls the AI-powered insights generation endpoint
 */

// Create a separate axios instance for the insights API (Model-3)
const insightsApi = axios.create({
  baseURL: import.meta.env.VITE_INSIGHTS_API_URL || 'http://localhost:8003',
  timeout: 60000, // Longer timeout for LLM processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
insightsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[InsightsService] API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const insightsService = {
  /**
   * Generate AI market insights from skill gap and career recommendation data
   * @param {Object} mlData - Contains skill_gap and career_recommendation
   * @returns {Promise} - InsightsResponse with AI-generated insights
   */
  generateInsights: async (mlData) => {
    try {
      const response = await insightsApi.post('/api/v1/insights', mlData);
      return response.data;
    } catch (error) {
      console.error('[InsightsService] Failed to generate insights:', error);
      throw error;
    }
  },

  /**
   * Get demo insights with sample data (for testing)
   * @returns {Promise} - InsightsResponse with sample AI insights
   */
  getDemoInsights: async () => {
    try {
      const response = await insightsApi.post('/api/v1/insights/demo');
      return response.data;
    } catch (error) {
      console.error('[InsightsService] Failed to get demo insights:', error);
      throw error;
    }
  },

  /**
   * Health check for the insights API
   * @returns {Promise} - Health status
   */
  healthCheck: async () => {
    try {
      const response = await insightsApi.get('/api/v1/health');
      return response.data;
    } catch (error) {
      console.error('[InsightsService] Health check failed:', error);
      throw error;
    }
  },

  /**
   * Transform dashboard ML data to the format expected by the insights API
   * @param {Object} dashboardData - Data from the dashboard service
   * @param {Object} mlData - Extracted ML data
   * @returns {Object} - Formatted payload for insights API
   */
  formatPayloadFromDashboard: (dashboardData, mlData) => {
    // Extract skill gap data
    const skillGapScore = mlData?.skillGapScore ?? 0;
    const timeToReadyMonths = mlData?.timeToReadyMonths ?? 0;
    const recommendedSkills = mlData?.recommendedSkills || [];
    
    // Format recommended skills with confidence scores
    const formattedSkills = recommendedSkills.map((skill, index) => ({
      skill: typeof skill === 'string' ? skill : skill.skill || skill.name,
      confidence: skill.confidence || (100 - index * 10) // Use provided confidence or generate based on position
    }));

    // Extract career recommendation data
    const targetRole = dashboardData?.careerSummary?.targetJobRole || 'Career Professional';
    const targetSector = dashboardData?.careerSummary?.sector || 'Technology';
    
    // Format courses
    const recommendedCourses = (mlData?.recommendedCourses || []).map(course => ({
      title: course.title || course.name,
      difficulty: course.difficulty || 'Intermediate',
      duration_weeks: course.durationWeeks || parseInt(course.duration) || 4,
      skills_covered: course.skills || course.skillsCovered || []
    }));

    // Format projects
    const recommendedProjects = (mlData?.recommendedProjects || []).map(project => ({
      title: project.title || project.name,
      difficulty: project.difficulty || 'Intermediate',
      duration_weeks: project.durationWeeks || parseInt(project.duration) || 4,
      skills_required: project.skills || project.skillsRequired || []
    }));

    return {
      skill_gap: {
        skill_gap_score: skillGapScore,
        time_to_ready_months: timeToReadyMonths,
        recommended_skills: formattedSkills,
        status: skillGapScore < 5 ? 'Ready' : skillGapScore < 10 ? 'In Progress' : 'Needs Work'
      },
      career_recommendation: {
        target_role: targetRole,
        target_sector: targetSector,
        recommended_courses: recommendedCourses,
        recommended_projects: recommendedProjects
      }
    };
  }
};

export default insightsService;
