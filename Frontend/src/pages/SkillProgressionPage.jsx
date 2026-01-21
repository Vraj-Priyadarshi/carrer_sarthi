import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Info,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useDashboardContext } from '../components/layout/DashboardLayout';
import SkillMappingModal from '../components/dashboard/SkillMappingModal';

/**
 * SkillProgressionPage
 * Displays:
 * 1. Radar (Spider) Chart - Current vs Target skill levels
 * 2. Skill Gap Progress Bars - Animated, color-coded
 * 3. Clickable skills for course/project mapping
 */
export default function SkillProgressionPage() {
  const { mlData, dashboardData, refreshKey } = useDashboardContext();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showMappingModal, setShowMappingModal] = useState(false);

  // Extract skill data from ML API response
  // recommendedSkillsWithConfidence contains: { skill: "name", confidence: number }
  const skillsWithConfidence = mlData?.recommendedSkillsWithConfidence || [];
  const skillGapScore = mlData?.skillGapScore;
  const hasValidData = skillGapScore !== null && skillGapScore !== undefined;

  /**
   * Prepare data for Radar Chart
   * Each axis represents a skill
   * Two datasets: Current level (confidence) vs Target level (100%)
   */
  const radarData = skillsWithConfidence.map(item => ({
    skill: typeof item === 'string' ? item : item.skill,
    // Current skill level from ML confidence score
    current: typeof item === 'string' ? 50 : (item.confidence || 0),
    // Target level is always 100% (goal)
    target: 100,
    // Full name for tooltip
    fullName: typeof item === 'string' ? item : item.skill,
  }));

  /**
   * Get color based on skill proficiency percentage
   * <30% = red (needs improvement)
   * 30-60% = yellow (progressing)
   * >60% = green (proficient)
   */
  const getSkillColor = (value) => {
    if (value < 30) return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
    if (value <= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' };
    return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20' };
  };

  // Calculate overall match percentage
  const matchPercentage = hasValidData ? Math.max(0, Math.min(100, 100 - skillGapScore)) : 0;

  // Handle skill click for mapping modal
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setShowMappingModal(true);
  };

  // Custom tooltip for radar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{data.fullName}</p>
          <p className="text-blue-400 text-sm">Current: {data.current.toFixed(1)}%</p>
          <p className="text-green-400 text-sm">Target: {data.target}%</p>
          <p className="text-gray-400 text-xs mt-1">Gap: {(data.target - data.current).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* No Data Warning */}
      {!hasValidData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-4"
        >
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-yellow-300 font-medium mb-1">ML Analysis Unavailable</h3>
            <p className="text-yellow-300/70 text-sm">
              Unable to fetch skill predictions from ML services. Please ensure all services are running.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Skill Radar</h2>
                <p className="text-gray-400 text-sm">Current vs Target Proficiency</p>
              </div>
            </div>
            <div className="group relative">
              <Info className="w-5 h-5 text-gray-500 cursor-help" />
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                This radar chart shows how close you are to the required skill level for your target role. 
                The blue area represents your current skills, while the green outline shows the target level (100%).
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          {radarData.length > 0 ? (
            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
                  <PolarGrid 
                    stroke="#374151" 
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: '#4B5563' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    tickCount={5}
                  />
                  {/* Target Level - Green outline */}
                  <Radar
                    name="Target Level"
                    dataKey="target"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  {/* Current Level - Blue filled */}
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[450px] flex items-center justify-center">
              <p className="text-gray-500">No skill data available</p>
            </div>
          )}
        </motion.div>

        {/* Overall Skill Match Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Overall Skill Match</h2>
              <p className="text-gray-400 text-sm">Your readiness for target role</p>
            </div>
          </div>

          {/* Large percentage display */}
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              className="relative inline-flex items-center justify-center"
            >
              {/* Circular progress background */}
              <svg className="w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#374151"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={matchPercentage >= 60 ? '#10B981' : matchPercentage >= 30 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - matchPercentage / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  transform="rotate(-90 96 96)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${
                  matchPercentage >= 60 ? 'text-green-400' : matchPercentage >= 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {hasValidData ? matchPercentage.toFixed(0) : '--'}%
                </span>
                <span className="text-gray-400 text-sm mt-1">Skill Match</span>
              </div>
            </motion.div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-gray-500 mt-4 mb-4">
            {matchPercentage >= 90 ? 'Ready for the target role' :
             matchPercentage >= 75 ? 'Almost ready — focus on a few key gaps' :
             matchPercentage >= 50 ? 'Good foundation, improvement needed' :
             matchPercentage >= 25 ? 'Early stage — build core skills' :
             'Beginner level — start with fundamentals'}
          </p>

          {/* Status Badge */}
          <div className="text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              matchPercentage >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              matchPercentage >= 60 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              matchPercentage >= 40 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {matchPercentage >= 80 ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              {mlData?.predictionStatus || (matchPercentage >= 80 ? 'Ready' : matchPercentage >= 60 ? 'Almost Ready' : 'Needs Improvement')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Skill Gap Progress Bars Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Skill Gap Analysis</h2>
              <p className="text-gray-400 text-sm">Click on a skill to see matching courses & projects</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> &lt;30%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> 30-60%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> &gt;60%</span>
          </div>
        </div>

        {/* Progress Bars for each skill */}
        <div className="space-y-4">
          {skillsWithConfidence.length > 0 ? (
            skillsWithConfidence.map((item, index) => {
              const skillName = typeof item === 'string' ? item : item.skill;
              const confidence = typeof item === 'string' ? 50 : (item.confidence || 0);
              const colors = getSkillColor(confidence);

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => handleSkillClick(skillName)}
                  className={`w-full p-4 rounded-xl bg-gray-900/50 border ${colors.border} hover:border-blue-500/50 transition-all duration-200 group cursor-pointer text-left`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {skillName}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className={`${colors.text} font-bold`}>{confidence.toFixed(1)}%</span>
                  </div>
                  
                  {/* Animated Progress Bar */}
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bg} rounded-full shadow-lg ${colors.glow}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
                    />
                  </div>

                  {/* Gap indicator */}
                  <p className="text-gray-500 text-xs mt-2">
                    {(100 - confidence).toFixed(1)}% gap to close • Click to see learning resources
                  </p>
                </motion.button>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No skill recommendations available</p>
              <p className="text-gray-600 text-sm mt-1">Complete your profile to get AI-powered skill suggestions</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Skill Mapping Modal */}
      <SkillMappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        skill={selectedSkill}
        courses={mlData?.recommendedCourses || []}
        projects={mlData?.recommendedProjects || []}
      />
    </div>
  );
}
