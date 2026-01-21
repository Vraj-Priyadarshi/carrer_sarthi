import api from './api';

/**
 * Profile Service
 * Handles CRUD operations for courses, projects, certifications, and profile data
 */
const profileService = {
  // ==================== COURSES ====================
  
  /**
   * Get all courses for current user
   */
  getCourses: async () => {
    const response = await api.get('/api/courses/me');
    return response.data;
  },

  /**
   * Add a new course
   * @param {Object} courseData - { courseName, grade, platform, completionDate }
   */
  addCourse: async (courseData) => {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  },

  /**
   * Update an existing course
   * @param {string} id - Course UUID
   * @param {Object} courseData - Updated course data
   */
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  },

  /**
   * Delete a course
   * @param {string} id - Course UUID
   */
  deleteCourse: async (id) => {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },

  // ==================== PROJECTS ====================
  
  /**
   * Get all projects for current user
   */
  getProjects: async () => {
    const response = await api.get('/api/projects/me');
    return response.data;
  },

  /**
   * Add a new project
   * @param {Object} projectData - { projectTitle, domainSkills, complexityLevel, description, githubUrl, demoUrl }
   */
  addProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  /**
   * Update an existing project
   * @param {string} id - Project UUID
   * @param {Object} projectData - Updated project data
   */
  updateProject: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  /**
   * Delete a project
   * @param {string} id - Project UUID
   */
  deleteProject: async (id) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  // ==================== CERTIFICATIONS ====================
  
  /**
   * Get all certifications for current user
   */
  getCertifications: async () => {
    const response = await api.get('/api/certifications/me');
    return response.data;
  },

  /**
   * Add a new certification
   * @param {Object} certData - { certificationName }
   */
  addCertification: async (certData) => {
    const response = await api.post('/api/certifications', certData);
    return response.data;
  },

  /**
   * Delete a certification
   * @param {string} id - Certification UUID
   */
  deleteCertification: async (id) => {
    const response = await api.delete(`/api/certifications/${id}`);
    return response.data;
  },

  // ==================== ACADEMIC PROFILE ====================
  
  /**
   * Get academic profile
   */
  getAcademicProfile: async () => {
    const response = await api.get('/api/academic-profiles/me');
    return response.data;
  },

  /**
   * Update academic profile
   * @param {Object} profileData - { educationLevel, cgpaPercentage, fieldOfStudy, institution }
   */
  updateAcademicProfile: async (profileData) => {
    const response = await api.put('/api/academic-profiles/me', profileData);
    return response.data;
  },

  // ==================== CAREER PROFILE ====================
  
  /**
   * Get career profile
   */
  getCareerProfile: async () => {
    const response = await api.get('/api/career-profiles/me');
    return response.data;
  },

  /**
   * Update career profile
   * @param {Object} profileData - { industrySector, targetJobRole, careerGoals }
   */
  updateCareerProfile: async (profileData) => {
    const response = await api.put('/api/career-profiles/me', profileData);
    return response.data;
  },

  // ==================== SKILL PROFILE ====================
  
  /**
   * Get skill profile
   */
  getSkillProfile: async () => {
    const response = await api.get('/api/skill-profiles/me');
    return response.data;
  },

  /**
   * Update skill profile
   * @param {Object} skillData - Skill boolean flags
   */
  updateSkillProfile: async (skillData) => {
    const response = await api.put('/api/skill-profiles/me', skillData);
    return response.data;
  },
};

export default profileService;
