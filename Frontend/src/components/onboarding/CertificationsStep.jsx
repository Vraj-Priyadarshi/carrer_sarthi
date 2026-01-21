import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, X } from 'lucide-react';

const suggestedCertifications = {
  Healthcare: [
    'AWS Certified Healthcare',
    'HIPAA Compliance Certification',
    'HL7 FHIR Certification',
    'Health Informatics Certificate',
    'Clinical Data Management',
    'Certified Health Data Analyst (CHDA)',
  ],
  Agriculture: [
    'Precision Agriculture Certificate',
    'Drone Pilot License (Part 107)',
    'GIS Professional Certificate',
    'IoT Solutions Architect',
    'Agricultural Data Science',
    'Sustainable Agriculture Certification',
  ],
  Urban: [
    'Smart City Professional',
    'GIS Certificate (Esri)',
    'IoT Solutions Certification',
    'Building Automation Systems',
    'Urban Planning Certificate',
    'Smart Grid Certification',
  ],
};

export default function CertificationsStep({ formData, updateFormData }) {
  const [showForm, setShowForm] = useState(false);
  const [newCertification, setNewCertification] = useState('');

  const sector = formData.industrySector || 'Healthcare';
  const suggestions = suggestedCertifications[sector] || [];

  const handleAddCertification = (name) => {
    const certName = name || newCertification.trim();
    if (certName && !formData.certifications.some(c => c.certificationName === certName)) {
      updateFormData('certifications', [...formData.certifications, { certificationName: certName }]);
      setNewCertification('');
      setShowForm(false);
    }
  };

  const handleRemoveCertification = (index) => {
    const updated = formData.certifications.filter((_, i) => i !== index);
    updateFormData('certifications', updated);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Certifications
        </h2>
        <p className="text-gray-400">
          Add any relevant certifications you've earned
        </p>
      </div>

      {/* Existing Certifications */}
      {formData.certifications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {formData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">{cert.certificationName}</span>
              <button
                onClick={() => handleRemoveCertification(index)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Certification Form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-4"
        >
          <h4 className="font-medium text-white mb-4">Add Certification</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Certification Name</label>
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                placeholder="e.g., AWS Solutions Architect"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddCertification()}
                disabled={!newCertification.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-6"
        >
          <Plus className="w-5 h-5" />
          Add a Certification
        </button>
      )}

      {/* Suggested Certifications */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h4 className="text-sm font-medium text-gray-400 mb-3">
          Suggested certifications for {sector}:
        </h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((cert) => {
            const isAdded = formData.certifications.some(c => c.certificationName === cert);
            return (
              <button
                key={cert}
                onClick={() => !isAdded && handleAddCertification(cert)}
                disabled={isAdded}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  isAdded
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400 cursor-not-allowed'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                }`}
              >
                {isAdded ? '✓ ' : '+ '}{cert}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        {formData.certifications.length === 0 
          ? "This step is optional - you can skip if you don't have certifications yet"
          : `${formData.certifications.length} certification${formData.certifications.length !== 1 ? 's' : ''} added`
        }
      </p>
    </div>
  );
}
