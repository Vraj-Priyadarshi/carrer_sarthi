import { motion } from 'framer-motion';
import { Stethoscope, Leaf, Building2, CheckCircle2 } from 'lucide-react';

const sectors = [
  {
    id: 'Healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    description: 'Medical AI, Health Informatics, Digital Health, Telemedicine',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    roles: ['Health Data Analyst', 'Medical AI Engineer', 'Healthcare IT Specialist'],
  },
  {
    id: 'Agriculture',
    name: 'Agriculture',
    icon: Leaf,
    description: 'Precision Farming, AgriTech, Sustainable Agriculture, Farm Tech',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    roles: ['AgriTech Specialist', 'Precision Farming Engineer', 'Agricultural Data Scientist'],
  },
  {
    id: 'Urban',
    name: 'Urban & Smart City',
    icon: Building2,
    description: 'Smart Infrastructure, IoT Systems, Urban Planning Technology',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/50',
    roles: ['Smart City Architect', 'IoT Solutions Engineer', 'Urban Systems Analyst'],
  },
];

export default function SectorStep({ formData, updateFormData }) {
  const selectedSector = formData.industrySector;

  const handleSelect = (sectorId) => {
    updateFormData('industrySector', sectorId);
    
    // Reset sector-specific skills when changing sectors
    // Healthcare skills
    updateFormData('hasEhr', false);
    updateFormData('hasHl7Fhir', false);
    updateFormData('hasMedicalImaging', false);
    updateFormData('hasHealthcareSecurity', false);
    updateFormData('hasTelemedicine', false);
    
    // Agriculture skills
    updateFormData('hasIotSensors', false);
    updateFormData('hasDroneOps', false);
    updateFormData('hasPrecisionAg', false);
    updateFormData('hasCropModeling', false);
    updateFormData('hasSoilAnalysis', false);
    
    // Urban skills
    updateFormData('hasGis', false);
    updateFormData('hasSmartGrid', false);
    updateFormData('hasTrafficMgmt', false);
    updateFormData('hasUrbanIot', false);
    updateFormData('hasBuildingAuto', false);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Choose Your Industry Sector
        </h2>
        <p className="text-gray-400">
          Select the sector you want to build your career in
        </p>
      </div>

      <div className="space-y-4">
        {sectors.map((sector, index) => (
          <motion.button
            key={sector.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(sector.id)}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selectedSector === sector.id
                ? `${sector.bgColor} ${sector.borderColor}`
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sector.gradient} flex items-center justify-center flex-shrink-0`}>
                <sector.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{sector.name}</h3>
                  {selectedSector === sector.id && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">{sector.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {sector.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {!selectedSector && (
        <p className="text-center text-gray-500 mt-6 text-sm">
          Please select a sector to continue
        </p>
      )}
    </div>
  );
}
