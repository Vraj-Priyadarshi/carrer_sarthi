import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, Circle } from 'lucide-react';

const skillLabels = {
  // Healthcare
  hasEhr: 'EHR Systems',
  hasHl7Fhir: 'HL7/FHIR',
  hasMedicalImaging: 'Medical Imaging',
  hasHealthcareSecurity: 'Healthcare Security',
  hasTelemedicine: 'Telemedicine',
  // Agriculture
  hasIotSensors: 'IoT Sensors',
  hasDroneOps: 'Drone Operations',
  hasPrecisionAg: 'Precision Ag',
  hasCropModeling: 'Crop Modeling',
  hasSoilAnalysis: 'Soil Analysis',
  // Urban
  hasGis: 'GIS',
  hasSmartGrid: 'Smart Grid',
  hasTrafficMgmt: 'Traffic Mgmt',
  hasUrbanIot: 'Urban IoT',
  hasBuildingAuto: 'Building Auto',
  // Soft Skills
  hasCommunication: 'Communication',
  hasTeamwork: 'Teamwork',
  hasProblemSolving: 'Problem Solving',
  hasLeadership: 'Leadership',
};

const sectorSkills = {
  Healthcare: ['hasEhr', 'hasHl7Fhir', 'hasMedicalImaging', 'hasHealthcareSecurity', 'hasTelemedicine'],
  Agriculture: ['hasIotSensors', 'hasDroneOps', 'hasPrecisionAg', 'hasCropModeling', 'hasSoilAnalysis'],
  Urban: ['hasGis', 'hasSmartGrid', 'hasTrafficMgmt', 'hasUrbanIot', 'hasBuildingAuto'],
};

const softSkillKeys = ['hasCommunication', 'hasTeamwork', 'hasProblemSolving', 'hasLeadership'];

export default function SkillsOverview({ dashboardData }) {
  // Backend returns skillProfile with individual skill booleans
  const skillProfile = dashboardData?.skillProfile || {};
  // Backend returns careerSummary (not careerProfile)
  const sector = dashboardData?.careerSummary?.industrySector || 'Healthcare';

  // Get relevant technical skills for the sector
  const relevantTechnicalSkills = sectorSkills[sector] || sectorSkills.Healthcare;

  // Count acquired skills
  const acquiredTechnicalSkills = relevantTechnicalSkills.filter(key => skillProfile[key]).length;
  const acquiredSoftSkills = softSkillKeys.filter(key => skillProfile[key]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Skills Overview</h3>
          <p className="text-gray-400 text-sm">Your current skill set</p>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Technical Skills</span>
          <span className="text-xs text-gray-500">
            {acquiredTechnicalSkills}/{relevantTechnicalSkills.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {relevantTechnicalSkills.map((skillKey) => {
            const hasSkill = skillProfile[skillKey];
            return (
              <div
                key={skillKey}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  hasSkill 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-gray-700/30 border border-gray-700'
                }`}
              >
                {hasSkill ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}
                <span className={`text-xs ${hasSkill ? 'text-green-300' : 'text-gray-500'}`}>
                  {skillLabels[skillKey]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Soft Skills</span>
          <span className="text-xs text-gray-500">
            {acquiredSoftSkills}/{softSkillKeys.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {softSkillKeys.map((skillKey) => {
            const hasSkill = skillProfile[skillKey];
            return (
              <div
                key={skillKey}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  hasSkill 
                    ? 'bg-blue-500/10 border border-blue-500/30' 
                    : 'bg-gray-700/30 border border-gray-700'
                }`}
              >
                {hasSkill ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}
                <span className={`text-xs ${hasSkill ? 'text-blue-300' : 'text-gray-500'}`}>
                  {skillLabels[skillKey]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium text-white">
            {Math.round(((acquiredTechnicalSkills + acquiredSoftSkills) / (relevantTechnicalSkills.length + softSkillKeys.length)) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((acquiredTechnicalSkills + acquiredSoftSkills) / (relevantTechnicalSkills.length + softSkillKeys.length)) * 100}%` 
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
