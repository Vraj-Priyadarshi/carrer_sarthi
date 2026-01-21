import { motion } from 'framer-motion';
import { Target, Briefcase, Compass } from 'lucide-react';

const suggestedRoles = {
  Healthcare: [
    'Health Data Analyst',
    'Medical AI Engineer',
    'Healthcare IT Specialist',
    'Clinical Informatics Specialist',
    'Telemedicine Coordinator',
    'Health Systems Administrator',
    'Biomedical Data Scientist',
    'Digital Health Product Manager',
  ],
  Agriculture: [
    'AgriTech Specialist',
    'Precision Farming Engineer',
    'Agricultural Data Scientist',
    'Drone Operations Specialist',
    'Smart Farming Consultant',
    'IoT Agriculture Engineer',
    'Crop Analytics Manager',
    'Sustainable Agriculture Advisor',
  ],
  Urban: [
    'Smart City Architect',
    'IoT Solutions Engineer',
    'Urban Systems Analyst',
    'Smart Grid Engineer',
    'Traffic Systems Specialist',
    'GIS Analyst',
    'Building Automation Engineer',
    'Urban Data Scientist',
  ],
};

export default function CareerGoalsStep({ formData, updateFormData }) {
  const roles = suggestedRoles[formData.industrySector] || suggestedRoles.Healthcare;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Define Your Career Goals
        </h2>
        <p className="text-gray-400">
          What role are you targeting in {formData.industrySector || 'your chosen sector'}?
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Job Role */}
        <div>
          <label htmlFor="targetJobRole" className="block text-sm font-medium text-gray-300 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Target Job Role *
          </label>
          <input
            type="text"
            id="targetJobRole"
            value={formData.targetJobRole}
            onChange={(e) => updateFormData('targetJobRole', e.target.value)}
            placeholder="e.g., Healthcare Data Analyst, AgriTech Engineer"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
          />
          
          {/* Suggested Roles */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Suggested roles for {formData.industrySector}:</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role, index) => (
                <motion.button
                  key={role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => updateFormData('targetJobRole', role)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    formData.targetJobRole === role
                      ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                      : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Career Goals Description */}
        <div>
          <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-300 mb-2">
            <Compass className="w-4 h-4 inline mr-2" />
            Career Goals & Aspirations
          </label>
          <textarea
            id="careerGoals"
            value={formData.careerGoals}
            onChange={(e) => updateFormData('careerGoals', e.target.value)}
            placeholder="Describe your career aspirations, what impact you want to make, and where you see yourself in 5 years..."
            rows={5}
            maxLength={1000}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              This helps us personalize your recommendations
            </p>
            <p className="text-xs text-gray-500">
              {formData.careerGoals?.length || 0}/1000
            </p>
          </div>
        </div>
      </div>

      {/* Validation hint */}
      {!formData.targetJobRole && (
        <p className="text-center text-yellow-500/80 mt-6 text-sm">
          * Please select or enter a target job role to continue
        </p>
      )}
    </div>
  );
}
