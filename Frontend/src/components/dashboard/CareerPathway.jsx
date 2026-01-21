import { motion } from 'framer-motion';
import { Route, Target, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

export default function CareerPathway({ dashboardData, mlData }) {
  const careerProfile = dashboardData?.careerProfile;
  const targetRole = careerProfile?.targetJobRole || 'Target Role';
  const industrySector = careerProfile?.industrySector || 'Technology';

  // Generate pathway steps based on ML data
  const generatePathwaySteps = () => {
    const steps = [
      {
        title: 'Current Position',
        description: 'Based on your current skills and experience',
        status: 'completed',
        icon: CheckCircle2,
      },
      {
        title: 'Skill Development',
        description: mlData?.recommendedSkills?.slice(0, 2).join(', ') || 'Learning new skills',
        status: mlData?.skillGapScore > 30 ? 'in-progress' : 'completed',
        icon: mlData?.skillGapScore > 30 ? Circle : CheckCircle2,
      },
      {
        title: 'Project Experience',
        description: 'Build portfolio projects to demonstrate skills',
        status: mlData?.skillGapScore > 50 ? 'pending' : 'in-progress',
        icon: Circle,
      },
      {
        title: 'Certification',
        description: `Get certified in ${industrySector} technologies`,
        status: mlData?.skillGapScore > 70 ? 'pending' : 'in-progress',
        icon: Circle,
      },
      {
        title: targetRole,
        description: `Ready for ${targetRole} position`,
        status: 'pending',
        icon: Target,
      },
    ];

    return steps;
  };

  const pathwaySteps = generatePathwaySteps();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-gray-500 bg-gray-700/50 border-gray-600';
    }
  };

  const getLineColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Route className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Career Pathway</h3>
          <p className="text-gray-400 text-sm">Your journey to {targetRole}</p>
        </div>
      </div>

      {/* Pathway Timeline */}
      <div className="relative">
        {pathwaySteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-4 pb-6 last:pb-0"
          >
            {/* Icon and Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                <step.icon className="w-5 h-5" />
              </div>
              {index < pathwaySteps.length - 1 && (
                <div className={`w-0.5 h-full min-h-[40px] ${getLineColor(step.status)}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white">{step.title}</h4>
                {step.status === 'in-progress' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estimated Timeline */}
      {mlData?.timeToReadyMonths > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Estimated time to reach goal</span>
            <span className="text-lg font-semibold text-white">
              {mlData.timeToReadyMonths} month{mlData.timeToReadyMonths !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
