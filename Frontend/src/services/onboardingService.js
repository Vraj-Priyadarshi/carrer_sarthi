import api from './api';

/**
 * Onboarding Service
 * Handles onboarding status and submission
 */
const onboardingService = {
  /**
   * Get onboarding status for current user
   * @returns {Promise} - OnboardingStatusResponse
   */
  getStatus: async () => {
    const response = await api.get('/api/onboarding/status');
    return response.data;
  },

  /**
   * Submit complete onboarding data
   * @param {Object} onboardingData - Full onboarding form data
   * @returns {Promise} - MessageResponse
   */
  submit: async (onboardingData) => {
    const response = await api.post('/api/onboarding/submit', onboardingData);
    return response.data;
  },

  /**
   * Transform frontend form data to backend request format
   * @param {Object} formData - Raw form data from onboarding steps
   * @returns {Object} - OnboardingSubmitRequest format
   */
  transformFormData: (formData) => {
    return {
      academicProfile: {
        educationLevel: parseInt(formData.educationLevel) || 2,
        cgpaPercentage: parseFloat(formData.cgpaPercentage) || 0,
        fieldOfStudy: formData.fieldOfStudy || '',
        institution: formData.institution || null,
      },
      careerProfile: {
        industrySector: formData.industrySector, // Must be "Healthcare", "Agriculture", or "Urban"
        targetJobRole: formData.targetJobRole || '',
        careerGoals: formData.careerGoals || null,
      },
      skillProfile: {
        // Healthcare skills
        hasEhr: formData.hasEhr || false,
        hasHl7Fhir: formData.hasHl7Fhir || false,
        hasMedicalImaging: formData.hasMedicalImaging || false,
        hasHealthcareSecurity: formData.hasHealthcareSecurity || false,
        hasTelemedicine: formData.hasTelemedicine || false,
        // Agriculture skills
        hasIotSensors: formData.hasIotSensors || false,
        hasDroneOps: formData.hasDroneOps || false,
        hasPrecisionAg: formData.hasPrecisionAg || false,
        hasCropModeling: formData.hasCropModeling || false,
        hasSoilAnalysis: formData.hasSoilAnalysis || false,
        // Urban skills
        hasGis: formData.hasGis || false,
        hasSmartGrid: formData.hasSmartGrid || false,
        hasTrafficMgmt: formData.hasTrafficMgmt || false,
        hasUrbanIot: formData.hasUrbanIot || false,
        hasBuildingAuto: formData.hasBuildingAuto || false,
        // Soft skills
        hasCommunication: formData.hasCommunication || false,
        hasTeamwork: formData.hasTeamwork || false,
        hasProblemSolving: formData.hasProblemSolving || false,
        hasLeadership: formData.hasLeadership || false,
      },
      courses: (formData.courses || []).map((course) => ({
        courseName: course.courseName,
        grade: parseFloat(course.grade) || 0,
        platform: course.platform || null,
        completionDate: course.completionDate || null,
      })),
      projects: (formData.projects || []).map((project) => ({
        projectTitle: project.projectTitle,
        domainSkills: project.domainSkills || '',
        complexityLevel: parseInt(project.complexityLevel) || 2,
        description: project.description || null,
        githubUrl: project.githubUrl || null,
        demoUrl: project.demoUrl || null,
      })),
      certifications: (formData.certifications || []).map((cert) => ({
        certificationName: cert.certificationName || (typeof cert === 'string' ? cert : ''),
      })),
    };
  },
};

export default onboardingService;
