import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, Circle } from 'lucide-react';

const skillsBySeector = {
  Healthcare: {
    title: 'Healthcare Technology Skills',
    description: 'Select the healthcare tech skills you have experience with',
    skills: [
      { 
        id: 'hasEhr', 
        name: 'Electronic Health Records (EHR)', 
        description: 'Experience with EHR systems like Epic, Cerner'
      },
      { 
        id: 'hasHl7Fhir', 
        name: 'HL7/FHIR Standards', 
        description: 'Knowledge of healthcare data interchange standards'
      },
      { 
        id: 'hasMedicalImaging', 
        name: 'Medical Imaging', 
        description: 'Experience with DICOM, radiology systems, medical image processing'
      },
      { 
        id: 'hasHealthcareSecurity', 
        name: 'Healthcare Security (HIPAA)', 
        description: 'Understanding of HIPAA compliance and healthcare data security'
      },
      { 
        id: 'hasTelemedicine', 
        name: 'Telemedicine Platforms', 
        description: 'Experience with telehealth systems and remote patient monitoring'
      },
    ],
  },
  Agriculture: {
    title: 'Agricultural Technology Skills',
    description: 'Select the agritech skills you have experience with',
    skills: [
      { 
        id: 'hasIotSensors', 
        name: 'IoT Sensors', 
        description: 'Experience with agricultural sensors for soil, weather, crop monitoring'
      },
      { 
        id: 'hasDroneOps', 
        name: 'Drone Operations', 
        description: 'Agricultural drone piloting, aerial imaging, spraying systems'
      },
      { 
        id: 'hasPrecisionAg', 
        name: 'Precision Agriculture', 
        description: 'GPS-guided equipment, variable rate technology, farm management software'
      },
      { 
        id: 'hasCropModeling', 
        name: 'Crop Modeling', 
        description: 'Crop simulation, yield prediction, growth modeling'
      },
      { 
        id: 'hasSoilAnalysis', 
        name: 'Soil Analysis', 
        description: 'Soil testing, nutrient analysis, soil mapping technologies'
      },
    ],
  },
  Urban: {
    title: 'Smart City & Urban Systems Skills',
    description: 'Select the urban technology skills you have experience with',
    skills: [
      { 
        id: 'hasGis', 
        name: 'GIS (Geographic Information Systems)', 
        description: 'ArcGIS, QGIS, spatial data analysis, mapping'
      },
      { 
        id: 'hasSmartGrid', 
        name: 'Smart Grid Technology', 
        description: 'Smart meters, grid analytics, energy management systems'
      },
      { 
        id: 'hasTrafficMgmt', 
        name: 'Traffic Management Systems', 
        description: 'ITS, traffic signal optimization, congestion management'
      },
      { 
        id: 'hasUrbanIot', 
        name: 'Urban IoT', 
        description: 'Smart city sensors, environmental monitoring, urban data platforms'
      },
      { 
        id: 'hasBuildingAuto', 
        name: 'Building Automation', 
        description: 'BMS, HVAC control, smart building systems'
      },
    ],
  },
};

export default function TechnicalSkillsStep({ formData, updateFormData }) {
  const sector = formData.industrySector || 'Healthcare';
  const sectorConfig = skillsBySeector[sector];

  const toggleSkill = (skillId) => {
    updateFormData(skillId, !formData[skillId]);
  };

  const selectedCount = sectorConfig.skills.filter(s => formData[s.id]).length;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {sectorConfig.title}
        </h2>
        <p className="text-gray-400">
          {sectorConfig.description}
        </p>
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className={`text-sm font-medium ${selectedCount > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
          {selectedCount} skill{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="space-y-3">
        {sectorConfig.skills.map((skill, index) => (
          <motion.button
            key={skill.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleSkill(skill.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              formData[skill.id]
                ? 'bg-blue-500/10 border-blue-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              {formData[skill.id] ? (
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-medium text-white">{skill.name}</span>
                <p className="text-sm text-gray-400 mt-0.5">{skill.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        Don't worry if you haven't selected many - we'll help you build these skills!
      </p>
    </div>
  );
}
