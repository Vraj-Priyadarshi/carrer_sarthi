import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Route, 
  User, 
  BookOpen, 
  FolderGit2, 
  Target,
  Clock,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  GraduationCap,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useDashboardContext } from '../components/layout/DashboardLayout';

/**
 * CareerPathwayPage
 * Visual timeline showing the AI-recommended journey:
 * Current Position → Courses (ordered by difficulty) → Projects → Target Role
 */
export default function CareerPathwayPage() {
  const { mlData, dashboardData, refreshKey } = useDashboardContext();
  const [expandedStep, setExpandedStep] = useState(null);

  // Extract data for timeline
  const courses = mlData?.recommendedCourses || [];
  const projects = mlData?.recommendedProjects || [];
  const targetRole = dashboardData?.careerSummary?.targetJobRole || 'Your Target Role';
  const targetSector = dashboardData?.careerSummary?.industrySector || 'Your Industry';
  const currentEducation = dashboardData?.education?.level || 'Current Position';
  const timeToReady = mlData?.timeToReadyMonths;

  /**
   * Sort courses by difficulty level
   * Beginner → Intermediate → Advanced
   */
  const sortByDifficulty = (items) => {
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    return [...items].sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty?.toLowerCase()] || 2;
      const orderB = difficultyOrder[b.difficulty?.toLowerCase()] || 2;
      return orderA - orderB;
    });
  };

  const sortedCourses = sortByDifficulty(courses);
  const sortedProjects = sortByDifficulty(projects);

  // Calculate total duration
  const totalWeeks = [...courses, ...projects].reduce((sum, item) => sum + (item.durationWeeks || 0), 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' };
      case 'intermediate':
        return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'advanced':
        return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-400', border: 'border-gray-500' };
    }
  };

  // Timeline steps
  const timelineSteps = [
    {
      id: 'current',
      type: 'milestone',
      title: 'Current Position',
      subtitle: currentEducation,
      icon: User,
      color: 'blue',
      completed: true,
    },
    ...sortedCourses.map((course, index) => ({
      id: `course-${index}`,
      type: 'course',
      title: course.title || course.name,
      subtitle: `${course.durationWeeks || '?'} weeks • ${course.difficulty || 'N/A'}`,
      icon: BookOpen,
      color: 'indigo',
      completed: false,
      details: course,
      difficulty: course.difficulty,
    })),
    ...sortedProjects.map((project, index) => ({
      id: `project-${index}`,
      type: 'project',
      title: project.title || project.name,
      subtitle: `${project.durationWeeks || '?'} weeks • ${project.difficulty || project.complexity || 'N/A'}`,
      icon: FolderGit2,
      color: 'purple',
      completed: false,
      details: project,
      difficulty: project.difficulty || project.complexity,
    })),
    {
      id: 'target',
      type: 'milestone',
      title: targetRole,
      subtitle: targetSector,
      icon: Target,
      color: 'green',
      completed: false,
      isTarget: true,
    },
  ];

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <GraduationCap className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{courses.length}</p>
          <p className="text-gray-400 text-sm">Courses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <FolderGit2 className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">{projects.length}</p>
          <p className="text-gray-400 text-sm">Projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <Clock className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">{totalWeeks}</p>
          <p className="text-gray-400 text-sm">Total Weeks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <Target className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">
            {timeToReady ? `${timeToReady.toFixed(1)}` : '--'}
          </p>
          <p className="text-gray-400 text-sm">Months to Ready</p>
        </motion.div>
      </div>

      {/* Horizontal Journey Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Your Journey at a Glance
        </h3>
        
        <div className="flex items-center gap-2 min-w-max py-4">
          {/* Current Position */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <User className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-400 mt-2 max-w-20 text-center truncate">You</p>
          </div>

          <ArrowRight className="w-6 h-6 text-gray-600 flex-shrink-0" />

          {/* Courses */}
          {sortedCourses.length > 0 && (
            <>
              <div className="flex items-center gap-1">
                {sortedCourses.map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-indigo-500" />
                ))}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">{sortedCourses.length} Courses</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-600 flex-shrink-0" />
            </>
          )}

          {/* Projects */}
          {sortedProjects.length > 0 && (
            <>
              <div className="flex items-center gap-1">
                {sortedProjects.map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-purple-500" />
                ))}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs text-gray-400 mt-2">{sortedProjects.length} Projects</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-600 flex-shrink-0" />
            </>
          )}

          {/* Target Role */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 animate-pulse">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-400 mt-2 max-w-24 text-center">{targetRole}</p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Route className="w-5 h-5 text-indigo-400" />
          Detailed Learning Path
        </h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />

          {/* Timeline Steps */}
          <div className="space-y-4">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isExpanded = expandedStep === step.id;
              const diffColors = getDifficultyColor(step.difficulty);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    step.type === 'milestone' 
                      ? step.isTarget 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                        : step.completed 
                          ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                          : 'bg-gray-700'
                      : step.type === 'course'
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : 'bg-purple-500/20 border-2 border-purple-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${
                        step.isTarget ? 'text-white' : 
                        step.type === 'course' ? 'text-indigo-400' : 
                        step.type === 'project' ? 'text-purple-400' : 'text-gray-400'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div 
                    className={`bg-gray-900/50 border rounded-xl p-4 transition-all cursor-pointer ${
                      step.type === 'milestone' 
                        ? step.isTarget 
                          ? 'border-green-500/30 hover:border-green-500/50' 
                          : 'border-blue-500/30'
                        : step.type === 'course'
                          ? 'border-gray-700 hover:border-indigo-500/50'
                          : 'border-gray-700 hover:border-purple-500/50'
                    }`}
                    onClick={() => step.details && setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${
                            step.isTarget ? 'text-green-400' : 'text-white'
                          }`}>
                            {step.title}
                          </h4>
                          {step.difficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${diffColors.text} bg-gray-800 border ${diffColors.border}/30`}>
                              {step.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{step.subtitle}</p>
                      </div>
                      {step.details && (
                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      )}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && step.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-800"
                      >
                        {step.details.explanation && (
                          <p className="text-gray-300 text-sm mb-3">{step.details.explanation}</p>
                        )}
                        
                        {/* Skills */}
                        {(step.details.skills || step.details.technologies) && (
                          <div className="flex flex-wrap gap-2">
                            {(step.details.skills || step.details.technologies).map((skill, i) => (
                              <span 
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Pathway Insight</h3>
            <p className="text-gray-400">
              This learning path is optimized based on your current skills and target role. 
              Courses are ordered by difficulty (Beginner → Intermediate → Advanced) to build 
              foundational knowledge before tackling complex projects. Following this path 
              will prepare you for your goal of becoming a <span className="text-blue-400 font-medium">{targetRole}</span>.
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
