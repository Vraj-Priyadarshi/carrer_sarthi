import { motion } from 'framer-motion';
import { BookOpen, Play, ExternalLink, Youtube, Star, Clock } from 'lucide-react';

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function RecommendedCourses({ courses = [], youtubeVideos = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Recommended Learning</h3>
          <p className="text-gray-400 text-sm">AI-curated courses for your career path</p>
        </div>
      </div>

      {/* Courses Section */}
      {courses && courses.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Courses ({courses.length})</h4>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course, index) => {
              const courseName = typeof course === 'string' ? course : (course.name || course.title);
              const difficulty = typeof course === 'string' ? 'intermediate' : (course.difficulty || 'Intermediate');
              const difficultyClass = difficultyColors[difficulty.toLowerCase()] || difficultyColors.intermediate;
              const skills = typeof course === 'string' ? [] : (course.skills || []);
              
              return (
                <motion.div
                  key={course.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-medium text-white">{courseName}</h5>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyClass}`}>
                          {difficulty}
                        </span>
                      </div>
                      {course.domain && (
                        <p className="text-sm text-gray-400 mt-1">{course.domain}</p>
                      )}
                      {course.duration && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </p>
                      )}
                      {course.explanation && (
                        <p className="text-xs text-blue-400 mt-2 italic">{course.explanation}</p>
                      )}
                    </div>
                    {course.youtubeLink && (
                      <a
                        href={course.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  {/* Skills covered */}
                  {skills && skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-700/50">
                      {skills.slice(0, 4).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-500">
                          +{skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* YouTube Videos Section */}
      {youtubeVideos && youtubeVideos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Youtube className="w-4 h-4 text-red-500" />
            <h4 className="text-sm font-medium text-gray-400">Video Tutorials</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {youtubeVideos.slice(0, 4).map((video, index) => (
              <motion.a
                key={video.videoId || index}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-colors group"
              >
                <div className="relative">
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="text-sm font-medium text-white line-clamp-2">
                    {video.title}
                  </h5>
                  {video.channelTitle && (
                    <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!courses || courses.length === 0) && (!youtubeVideos || youtubeVideos.length === 0) && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No course recommendations available yet</p>
          <p className="text-gray-600 text-sm mt-1">Complete your profile for personalized suggestions</p>
        </div>
      )}
    </motion.div>
  );
}
