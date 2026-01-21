import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  GraduationCap, 
  Target, 
  Cpu, 
  Users, 
  BookOpen, 
  FolderGit2, 
  Award,
  Stethoscope,
  Leaf,
  Building2,
  Sparkles
} from 'lucide-react';

const sectorIcons = {
  Healthcare: Stethoscope,
  Agriculture: Leaf,
  Urban: Building2,
};

const educationLabels = {
  1: 'High School',
  2: 'Undergraduate',
  3: 'Postgraduate',
  4: 'PhD',
};

const skillLabels = {
  // Healthcare
  hasEhr: 'Electronic Health Records',
  hasHl7Fhir: 'HL7/FHIR Standards',
  hasMedicalImaging: 'Medical Imaging',
  hasHealthcareSecurity: 'Healthcare Security',
  hasTelemedicine: 'Telemedicine',
  // Agriculture
  hasIotSensors: 'IoT Sensors',
  hasDroneOps: 'Drone Operations',
  hasPrecisionAg: 'Precision Agriculture',
  hasCropModeling: 'Crop Modeling',
  hasSoilAnalysis: 'Soil Analysis',
  // Urban
  hasGis: 'GIS',
  hasSmartGrid: 'Smart Grid',
  hasTrafficMgmt: 'Traffic Management',
  hasUrbanIot: 'Urban IoT',
  hasBuildingAuto: 'Building Automation',
  // Soft Skills
  hasCommunication: 'Communication',
  hasTeamwork: 'Teamwork',
  hasProblemSolving: 'Problem Solving',
  hasLeadership: 'Leadership',
};

export default function ReviewStep({ formData }) {
  const SectorIcon = sectorIcons[formData.industrySector] || Building2;
  
  const technicalSkills = Object.entries(formData)
    .filter(([key, value]) => value === true && !['hasCommunication', 'hasTeamwork', 'hasProblemSolving', 'hasLeadership'].includes(key))
    .map(([key]) => skillLabels[key])
    .filter(Boolean);

  const softSkills = ['hasCommunication', 'hasTeamwork', 'hasProblemSolving', 'hasLeadership']
    .filter(key => formData[key])
    .map(key => skillLabels[key]);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Review Your Profile
        </h2>
        <p className="text-gray-400">
          Please review your information before completing setup
        </p>
      </div>

      <div className="space-y-4">
        {/* Sector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <SectorIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Industry Sector</p>
              <p className="font-medium text-white">{formData.industrySector || 'Not selected'}</p>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Education</p>
              <p className="font-medium text-white">{educationLabels[formData.educationLevel]}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-13">
            <div>
              <p className="text-gray-500">Field of Study</p>
              <p className="text-gray-300">{formData.fieldOfStudy || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-500">CGPA/Percentage</p>
              <p className="text-gray-300">{formData.cgpaPercentage || 0}</p>
            </div>
            {formData.institution && (
              <div className="col-span-2">
                <p className="text-gray-500">Institution</p>
                <p className="text-gray-300">{formData.institution}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Career Goals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Target Role</p>
              <p className="font-medium text-white">{formData.targetJobRole || 'Not specified'}</p>
            </div>
          </div>
          {formData.careerGoals && (
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{formData.careerGoals}</p>
          )}
        </motion.div>

        {/* Technical Skills */}
        {technicalSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Technical Skills</p>
                <p className="text-sm text-gray-400">{technicalSkills.length} skill{technicalSkills.length !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <span key={skill} className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Soft Skills */}
        {softSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Soft Skills</p>
                <p className="text-sm text-gray-400">{softSkills.length} skill{softSkills.length !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span key={skill} className="text-xs bg-green-500/10 border border-green-500/30 text-green-300 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Courses, Projects, Certifications Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <BookOpen className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formData.courses.length}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <FolderGit2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formData.projects.length}</p>
            <p className="text-xs text-gray-500">Projects</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formData.certifications.length}</p>
            <p className="text-xs text-gray-500">Certifications</p>
          </div>
        </motion.div>
      </div>

      {/* Ready Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl text-center"
      >
        <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
        <p className="text-white font-medium">You're all set!</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Complete Setup" to generate your personalized career recommendations
        </p>
      </motion.div>
    </div>
  );
}
