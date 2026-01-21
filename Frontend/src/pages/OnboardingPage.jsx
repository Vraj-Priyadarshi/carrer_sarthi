import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

// Import step components
import WelcomeStep from '../components/onboarding/WelcomeStep';
import SectorStep from '../components/onboarding/SectorStep';
import EducationStep from '../components/onboarding/EducationStep';
import CareerGoalsStep from '../components/onboarding/CareerGoalsStep';
import TechnicalSkillsStep from '../components/onboarding/TechnicalSkillsStep';
import SoftSkillsStep from '../components/onboarding/SoftSkillsStep';
import CoursesStep from '../components/onboarding/CoursesStep';
import ProjectsStep from '../components/onboarding/ProjectsStep';
import CertificationsStep from '../components/onboarding/CertificationsStep';
import ReviewStep from '../components/onboarding/ReviewStep';

const steps = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep },
  { id: 'sector', title: 'Industry Sector', component: SectorStep },
  { id: 'education', title: 'Education', component: EducationStep },
  { id: 'career', title: 'Career Goals', component: CareerGoalsStep },
  { id: 'technical', title: 'Technical Skills', component: TechnicalSkillsStep },
  { id: 'soft', title: 'Soft Skills', component: SoftSkillsStep },
  { id: 'courses', title: 'Courses', component: CoursesStep },
  { id: 'projects', title: 'Projects', component: ProjectsStep },
  { id: 'certifications', title: 'Certifications', component: CertificationsStep },
  { id: 'review', title: 'Review', component: ReviewStep },
];

const initialFormData = {
  // Sector
  industrySector: '',
  
  // Academic Profile
  educationLevel: 2, // Default to Undergraduate
  cgpaPercentage: 0,
  fieldOfStudy: '',
  institution: '',
  
  // Career Profile
  targetJobRole: '',
  careerGoals: '',
  
  // Technical Skills - Healthcare
  hasEhr: false,
  hasHl7Fhir: false,
  hasMedicalImaging: false,
  hasHealthcareSecurity: false,
  hasTelemedicine: false,
  
  // Technical Skills - Agriculture
  hasIotSensors: false,
  hasDroneOps: false,
  hasPrecisionAg: false,
  hasCropModeling: false,
  hasSoilAnalysis: false,
  
  // Technical Skills - Urban
  hasGis: false,
  hasSmartGrid: false,
  hasTrafficMgmt: false,
  hasUrbanIot: false,
  hasBuildingAuto: false,
  
  // Soft Skills
  hasCommunication: false,
  hasTeamwork: false,
  hasProblemSolving: false,
  hasLeadership: false,
  
  // Courses, Projects, Certifications
  courses: [],
  projects: [],
  certifications: [],
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  const { completeOnboarding, user, updateSector } = useAuth();
  const navigate = useNavigate();

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle next step
  const handleNext = () => {
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle skip (for optional steps)
  const handleSkip = () => {
    handleNext();
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await completeOnboarding(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding submit error:', err);
      setError(err.response?.data?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update sector theme when sector changes
  useEffect(() => {
    if (formData.industrySector) {
      updateSector(formData.industrySector);
    }
  }, [formData.industrySector, updateSector]);

  // Current step component
  const CurrentStepComponent = steps[currentStep].component;

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">Career Saarthi</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">
                {user?.firstName || 'Welcome'}
              </span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="fixed top-[65px] left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-white">
                {steps[currentStep].title}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Step Dots */}
            <div className="hidden md:flex justify-between mt-3">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-1 ${
                    index <= currentStep ? 'text-blue-400' : 'text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        index === currentStep 
                          ? 'bg-blue-500' 
                          : 'bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-40 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Error Alert */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {/* Skip Button (for optional steps) */}
              {['courses', 'projects', 'certifications'].includes(steps[currentStep].id) && (
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white px-4 py-2 transition-colors"
                >
                  Skip
                </button>
              )}

              {/* Next / Submit Button */}
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </AnimatedBackground>
  );
}
