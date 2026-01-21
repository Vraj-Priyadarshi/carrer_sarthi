import { motion } from 'framer-motion';
import { FolderGit2, Github, ExternalLink, Zap, Clock, Youtube } from 'lucide-react';

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const complexityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

export default function RecommendedProjects({ projects = [] }) {
  const getDifficultyFromProject = (project) => {
    if (typeof project === 'string') return 'Intermediate';
    return project.difficulty || project.level || 'Intermediate';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <FolderGit2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Project Ideas</h3>
          <p className="text-gray-400 text-sm">Build these to strengthen your skills</p>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.slice(0, 5).map((project, index) => {
            const projectName = typeof project === 'string' ? project : (project.name || project.title);
            const projectDescription = typeof project === 'string' ? null : (project.description || project.explanation);
            const projectSkills = typeof project === 'string' ? [] : (project.skills || project.technologies || []);
            const difficulty = getDifficultyFromProject(project);
            const difficultyClass = difficultyColors[difficulty.toLowerCase()] || difficultyColors.intermediate;
            const complexity = typeof project === 'string' ? null : project.complexity;
            const complexityClass = complexity ? (complexityColors[complexity.toLowerCase()] || complexityColors.medium) : null;
            const duration = typeof project === 'string' ? null : project.duration;

            return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-medium text-white">{projectName}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyClass}`}>
                        {difficulty}
                      </span>
                      {complexity && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${complexityClass}`}>
                          {complexity} complexity
                        </span>
                      )}
                    </div>
                    {project.domain && (
                      <p className="text-sm text-gray-400 mt-1">{project.domain}</p>
                    )}
                    {duration && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </p>
                    )}
                    {projectDescription && (
                      <p className="text-xs text-blue-400 mt-2 italic line-clamp-2">{projectDescription}</p>
                    )}
                  </div>
                  {project.youtubeLink && (
                    <a
                      href={project.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {projectSkills && projectSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {projectSkills.slice(0, 5).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {projectSkills.length > 5 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-500">
                        +{projectSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
                  <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Start Project
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1">
                    <Github className="w-3 h-3" />
                    View Template
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No project recommendations available yet</p>
          <p className="text-gray-600 text-sm mt-1">Update your skills to get personalized project ideas</p>
        </div>
      )}
    </motion.div>
  );
}
