import { motion } from 'framer-motion';
import { GraduationCap, Building, BookOpen, Award } from 'lucide-react';

const educationLevels = [
  { value: 1, label: 'High School', description: 'Secondary education diploma' },
  { value: 2, label: 'Undergraduate', description: "Bachelor's degree" },
  { value: 3, label: 'Postgraduate', description: "Master's degree" },
  { value: 4, label: 'PhD', description: 'Doctorate degree' },
];

export default function EducationStep({ formData, updateFormData }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Your Academic Background
        </h2>
        <p className="text-gray-400">
          Tell us about your educational journey
        </p>
      </div>

      <div className="space-y-6">
        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <Award className="w-4 h-4 inline mr-2" />
            Education Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {educationLevels.map((level, index) => (
              <motion.button
                key={level.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => updateFormData('educationLevel', level.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.educationLevel === level.value
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="font-medium text-white">{level.label}</span>
                <p className="text-xs text-gray-400 mt-1">{level.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Field of Study */}
        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-300 mb-2">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Field of Study *
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
            placeholder="e.g., Computer Science, Data Science, Engineering"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Institution
          </label>
          <input
            type="text"
            id="institution"
            value={formData.institution}
            onChange={(e) => updateFormData('institution', e.target.value)}
            placeholder="e.g., MIT, Stanford University, IIT Delhi"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* CGPA/Percentage */}
        <div>
          <label htmlFor="cgpaPercentage" className="block text-sm font-medium text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            CGPA / Percentage *
          </label>
          <div className="relative">
            <input
              type="number"
              id="cgpaPercentage"
              value={formData.cgpaPercentage || ''}
              onChange={(e) => updateFormData('cgpaPercentage', parseFloat(e.target.value) || 0)}
              placeholder="Enter your CGPA (0-10) or Percentage (0-100)"
              min="0"
              max="100"
              step="0.01"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter CGPA on scale of 10 or percentage (0-100)
          </p>
        </div>
      </div>

      {/* Validation hint */}
      {(!formData.fieldOfStudy || formData.cgpaPercentage === 0) && (
        <p className="text-center text-yellow-500/80 mt-6 text-sm">
          * Required fields must be filled to continue
        </p>
      )}
    </div>
  );
}
