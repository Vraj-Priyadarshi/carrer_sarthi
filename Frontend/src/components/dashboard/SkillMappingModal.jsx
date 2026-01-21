import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  FolderGit2, 
  Clock, 
  Signal, 
  ExternalLink,
  Sparkles,
  CheckCircle
} from 'lucide-react';

/**
 * SkillMappingModal
 * Shows courses and projects related to a selected skill
 * Demonstrates AI-powered personalization by mapping skills to learning resources
 */
export default function SkillMappingModal({ isOpen, onClose, skill, courses = [], projects = [] }) {
  if (!isOpen || !skill) return null;

  /**
   * Filter courses that cover this skill
   * Matches skill name against skills_covered array from ML API
   */
  const relatedCourses = courses.filter(course => {
    const courseSkills = course.skills || course.skillsCovered || [];
    return courseSkills.some(s => 
      s.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(s.toLowerCase())
    );
  });

  /**
   * Filter projects that require this skill
   * Matches skill name against skills_required array from ML API
   */
  const relatedProjects = projects.filter(project => {
    const projectSkills = project.skills || project.technologies || project.skillsRequired || [];
    return projectSkills.some(s => 
      s.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(s.toLowerCase())
    );
  });

  // If no exact matches, show top recommendations
  const displayCourses = relatedCourses.length > 0 ? relatedCourses : courses.slice(0, 3);
  const displayProjects = relatedProjects.length > 0 ? relatedProjects : projects.slice(0, 2);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Learning Path for "{skill}"</h2>
                  <p className="text-gray-400 text-sm">AI-recommended resources to develop this skill</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Courses Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Recommended Courses</h3>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    {displayCourses.length} courses
                  </span>
                </div>

                {displayCourses.length > 0 ? (
                  <div className="space-y-3">
                    {displayCourses.map((course, index) => (
                      <motion.div
                        key={course.id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {course.title || course.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty || 'N/A'}
                          </span>
                        </div>

                        {course.explanation && (
                          <p className="text-gray-400 text-sm mb-3">{course.explanation}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          {course.durationWeeks && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              {course.durationWeeks} weeks
                            </span>
                          )}
                          {course.skills && course.skills.length > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Signal className="w-4 h-4" />
                              {course.skills.slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Skills covered badges */}
                        {course.skills && course.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {course.skills.map((s, i) => (
                              <span 
                                key={i}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-gray-700/50 text-gray-400'
                                }`}
                              >
                                {s.toLowerCase().includes(skill.toLowerCase()) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {course.youtubeLink && (
                          <a
                            href={course.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Watch on YouTube
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-800/30 rounded-xl">
                    <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No courses found for this skill</p>
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FolderGit2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Recommended Projects</h3>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    {displayProjects.length} projects
                  </span>
                </div>

                {displayProjects.length > 0 ? (
                  <div className="space-y-3">
                    {displayProjects.map((project, index) => (
                      <motion.div
                        key={project.id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                            {project.title || project.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(project.difficulty || project.complexity)}`}>
                            {project.difficulty || project.complexity || 'N/A'}
                          </span>
                        </div>

                        {project.explanation && (
                          <p className="text-gray-400 text-sm mb-3">{project.explanation}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          {project.durationWeeks && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              {project.durationWeeks} weeks
                            </span>
                          )}
                        </div>

                        {/* Skills required badges */}
                        {(project.skills || project.technologies) && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {(project.skills || project.technologies).map((s, i) => (
                              <span 
                                key={i}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-gray-700/50 text-gray-400'
                                }`}
                              >
                                {s.toLowerCase().includes(skill.toLowerCase()) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-800/30 rounded-xl">
                    <FolderGit2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No projects found for this skill</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/80">
              <p className="text-center text-gray-500 text-sm">
                💡 These recommendations are personalized based on your target role and current skill level
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
