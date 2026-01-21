import { motion } from 'framer-motion';
import { TrendingUp, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SkillGapCard({ skillGapScore, recommendedSkills = [], sectorTheme }) {
  // Check if we have valid data from ML API
  const hasValidData = skillGapScore !== null && skillGapScore !== undefined && !isNaN(skillGapScore);
  
  // skillGapScore is the GAP percentage (lower is better)
  // e.g., 8.97 means 8.97% gap = 91.03% match
  const gapPercentage = hasValidData ? Math.max(0, Math.min(100, skillGapScore)) : null;
  const matchPercentage = hasValidData ? Math.max(0, Math.min(100, 100 - skillGapScore)) : null;

  // Determine color based on match score (higher is better)
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Skill Gap Analysis</h3>
            <p className="text-gray-400 text-sm">AI-powered skill assessment</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${hasValidData ? getScoreColor(matchPercentage) : 'text-gray-500'}`}>
          {hasValidData ? `${matchPercentage.toFixed(1)}%` : 'N/A'}
        </div>
      </div>

      {/* No data warning */}
      {!hasValidData && (
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 text-sm">ML analysis unavailable. Please ensure all services are running.</span>
        </div>
      )}

      {/* Progress Bar */}
      {hasValidData && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Skill Match</span>
            <span className="text-gray-400">{gapPercentage.toFixed(1)}% gap to close</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getProgressColor(matchPercentage)}`}
              initial={{ width: 0 }}
              animate={{ width: `${matchPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Recommended Skills */}
      {recommendedSkills && recommendedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Skills to Develop</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="text-sm px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* No recommendations fallback */}
      {(!recommendedSkills || recommendedSkills.length === 0) && matchPercentage >= 80 && (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">Great job! Your skills are well-aligned with your target role.</span>
        </div>
      )}
    </motion.div>
  );
}
