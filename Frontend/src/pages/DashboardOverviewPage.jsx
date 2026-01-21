import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  FolderGit2, 
  Target,
  ChevronRight,
  Zap,
  Clock,
  Route,
  User,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../components/layout/DashboardLayout';

/**
 * DashboardOverviewPage
 * High-level overview with quick stats and navigation to detailed sections
 * This is the main landing page after login
 */
export default function DashboardOverviewPage() {
  const { dashboardData, mlData, user, refreshKey, currentSector } = useDashboardContext();

  // Extract key metrics from ML data
  const skillGapScore = mlData?.skillGapScore;
  const matchPercentage = skillGapScore != null ? Math.max(0, Math.min(100, 100 - skillGapScore)) : null;
  const timeToReady = mlData?.timeToReadyMonths;
  const recommendedSkills = mlData?.recommendedSkills || [];
  const courses = mlData?.recommendedCourses || [];
  const projects = mlData?.recommendedProjects || [];

  // Target role info
  const targetRole = dashboardData?.careerSummary?.targetJobRole || 'Your Target Role';

  // Quick action cards
  const quickActions = [
    {
      title: 'Skill Progression',
      description: 'View your skill radar and gap analysis',
      icon: TrendingUp,
      path: '/skills',
      color: 'blue',
      stat: recommendedSkills.length > 0 ? `${recommendedSkills.length} skills to develop` : null,
    },
    {
      title: 'Career Pathway',
      description: 'Explore your AI-recommended journey',
      icon: Route,
      path: '/pathway',
      color: 'indigo',
      stat: courses.length + projects.length > 0 ? `${courses.length + projects.length} steps to goal` : null,
    },
    {
      title: 'Learning Hub',
      description: 'Courses and projects for you',
      icon: BookOpen,
      path: '/learning',
      color: 'purple',
      stat: courses.length > 0 ? `${courses.length} courses ready` : null,
    },
    {
      title: 'Your Profile',
      description: 'Manage skills and achievements',
      icon: User,
      path: '/profile',
      color: 'green',
      stat: null,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', gradient: 'from-blue-500 to-cyan-500' },
      indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', gradient: 'from-indigo-500 to-purple-500' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-500 to-pink-500' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', gradient: 'from-green-500 to-emerald-500' },
      yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', gradient: 'from-yellow-500 to-orange-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back{user?.firstName || user?.fullName || user?.email ? `, ${user?.firstName || user?.fullName?.split(' ')[0] || user?.email?.split('@')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-400">
          Here's your personalized career intelligence dashboard for {currentSector}
        </p>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-5"
        >
          <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white">
            {matchPercentage != null ? `${matchPercentage.toFixed(0)}%` : '--'}
          </p>
          <p className="text-gray-400 text-sm">Skill Match</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5"
        >
          <Clock className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-3xl font-bold text-white">
            {timeToReady != null ? timeToReady.toFixed(1) : '--'}
          </p>
          <p className="text-gray-400 text-sm">Months to Ready</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-5"
        >
          <BookOpen className="w-8 h-8 text-yellow-400 mb-3" />
          <p className="text-3xl font-bold text-white">{courses.length}</p>
          <p className="text-gray-400 text-sm">Recommended Courses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-5"
        >
          <FolderGit2 className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white">{projects.length}</p>
          <p className="text-gray-400 text-sm">Project Ideas</p>
        </motion.div>
      </div>

      {/* Target Role Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Your Target Role</p>
              <h2 className="text-xl font-bold text-white">{targetRole}</h2>
            </div>
          </div>
          <Link
            to="/pathway"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            View Career Path
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Explore Your Dashboard
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const colors = getColorClasses(action.color);
            const Icon = action.icon;
            
            return (
              <Link
                key={action.path}
                to={action.path}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`h-full bg-gray-800/50 border ${colors.border} rounded-2xl p-5 cursor-pointer group transition-all hover:border-opacity-50`}
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                    {action.title}
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-gray-500 text-sm mb-2">{action.description}</p>
                  {action.stat && (
                    <span className={`text-xs ${colors.text}`}>{action.stat}</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Skills to Develop Preview */}
      {recommendedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Skills to Develop</h3>
                <p className="text-gray-400 text-sm">AI-identified areas for growth</p>
              </div>
            </div>
            <Link
              to="/skills"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {recommendedSkills.slice(0, 6).map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-sm"
              >
                {skill}
              </motion.span>
            ))}
            {recommendedSkills.length > 6 && (
              <Link
                to="/skills"
                className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-xl text-sm hover:bg-gray-700 transition-colors"
              >
                +{recommendedSkills.length - 6} more
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/10 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Career Insight</h3>
            <p className="text-gray-400">
              {matchPercentage != null && matchPercentage >= 80 
                ? `Great progress! You're ${matchPercentage.toFixed(0)}% ready for your target role. Focus on the remaining skills to reach your goal.`
                : matchPercentage != null && matchPercentage >= 50
                  ? `You're making good progress at ${matchPercentage.toFixed(0)}% skill match. The recommended courses and projects will help bridge the remaining gap.`
                  : `Based on your profile, we've identified key skills to develop for your goal of becoming a ${targetRole}. Start with the recommended courses to build your foundation.`
              }
            </p>
            {mlData?.reasoning && (
              <p className="text-gray-500 text-sm mt-2 italic">"{mlData.reasoning}"</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
