import { motion } from 'framer-motion';
import { Users, CheckCircle2, Circle, MessageSquare, Lightbulb, UserCheck, Trophy } from 'lucide-react';

const softSkills = [
  { 
    id: 'hasCommunication', 
    name: 'Communication', 
    icon: MessageSquare,
    description: 'Clear verbal and written communication, presentation skills',
    color: 'text-blue-400',
  },
  { 
    id: 'hasTeamwork', 
    name: 'Teamwork & Collaboration', 
    icon: Users,
    description: 'Working effectively in teams, cross-functional collaboration',
    color: 'text-green-400',
  },
  { 
    id: 'hasProblemSolving', 
    name: 'Problem Solving', 
    icon: Lightbulb,
    description: 'Analytical thinking, creative solutions, troubleshooting',
    color: 'text-yellow-400',
  },
  { 
    id: 'hasLeadership', 
    name: 'Leadership', 
    icon: Trophy,
    description: 'Taking initiative, mentoring others, project management',
    color: 'text-purple-400',
  },
];

export default function SoftSkillsStep({ formData, updateFormData }) {
  const toggleSkill = (skillId) => {
    updateFormData(skillId, !formData[skillId]);
  };

  const selectedCount = softSkills.filter(s => formData[s.id]).length;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Professional Soft Skills
        </h2>
        <p className="text-gray-400">
          Select the soft skills you're confident in
        </p>
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className={`text-sm font-medium ${selectedCount > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
          {selectedCount} skill{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {softSkills.map((skill, index) => (
          <motion.button
            key={skill.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleSkill(skill.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all ${
              formData[skill.id]
                ? 'bg-blue-500/10 border-blue-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${
                formData[skill.id] ? 'bg-blue-500/20' : 'bg-gray-700/50'
              } flex items-center justify-center flex-shrink-0`}>
                <skill.icon className={`w-5 h-5 ${
                  formData[skill.id] ? skill.color : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{skill.name}</span>
                  {formData[skill.id] ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        Soft skills are crucial for career success in any sector
      </p>
    </div>
  );
}
