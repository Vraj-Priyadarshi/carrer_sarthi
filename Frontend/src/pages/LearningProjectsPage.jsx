import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  FolderGit2, 
  Clock, 
  Signal, 
  ExternalLink,
  Play,
  ChevronDown,
  Star,
  Filter,
  Search,
  Sparkles,
  GraduationCap,
  Code2
} from 'lucide-react';
import { useDashboardContext } from '../components/layout/DashboardLayout';

/**
 * LearningProjectsPage
 * Displays:
 * 1. Recommended Courses with difficulty badges and YouTube links
 * 2. Recommended Projects with skill requirements
 * 3. Filter and search functionality
 */
export default function LearningProjectsPage() {
  const { mlData, refreshKey } = useDashboardContext();
  const [activeTab, setActiveTab] = useState('courses');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  const courses = mlData?.recommendedCourses || [];
  const projects = mlData?.recommendedProjects || [];

  // Filter items based on difficulty and search
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesDifficulty = difficultyFilter === 'all' || 
        item.difficulty?.toLowerCase() === difficultyFilter ||
        item.complexity?.toLowerCase() === difficultyFilter;
      
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDifficulty && matchesSearch;
    });
  };

  const filteredCourses = filterItems(courses);
  const filteredProjects = filterItems(projects);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return { 
          bg: 'bg-green-500/20', 
          text: 'text-green-400', 
          border: 'border-green-500/30',
          badge: 'bg-green-500'
        };
      case 'intermediate':
        return { 
          bg: 'bg-yellow-500/20', 
          text: 'text-yellow-400', 
          border: 'border-yellow-500/30',
          badge: 'bg-yellow-500'
        };
      case 'advanced':
        return { 
          bg: 'bg-red-500/20', 
          text: 'text-red-400', 
          border: 'border-red-500/30',
          badge: 'bg-red-500'
        };
      default:
        return { 
          bg: 'bg-gray-500/20', 
          text: 'text-gray-400', 
          border: 'border-gray-500/30',
          badge: 'bg-gray-500'
        };
    }
  };

  // Course Card Component
  const CourseCard = ({ course, index }) => {
    const colors = getDifficultyColor(course.difficulty);
    const isExpanded = expandedCard === `course-${index}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-gray-800/50 border ${colors.border} rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group`}
      >
        {/* Card Header with gradient accent */}
        <div className={`h-2 ${colors.badge}`} />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {course.difficulty || 'N/A'}
                </span>
                {course.domain && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400">
                    {course.domain}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {course.title || course.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{course.durationWeeks || '?'}w</span>
            </div>
          </div>

          {/* Explanation from ML */}
          {course.explanation && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {course.explanation}
            </p>
          )}

          {/* Skills Covered - ML data mapping */}
          {course.skills && course.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Signal className="w-3 h-3" />
                Skills you'll learn:
              </p>
              <div className="flex flex-wrap gap-2">
                {course.skills.slice(0, isExpanded ? undefined : 3).map((skill, i) => (
                  <span 
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
                {!isExpanded && course.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{course.skills.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpandedCard(isExpanded ? null : `course-${index}`)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show more'}
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {course.youtubeLink && (
              <a
                href={course.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch on YouTube
              </a>
            )}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors">
              <Star className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Project Card Component
  const ProjectCard = ({ project, index }) => {
    const colors = getDifficultyColor(project.difficulty || project.complexity);
    const isExpanded = expandedCard === `project-${index}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-gray-800/50 border ${colors.border} rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group`}
      >
        {/* Card Header with gradient accent */}
        <div className={`h-2 ${colors.badge}`} />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {project.difficulty || project.complexity || 'N/A'}
                </span>
                {project.domain && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400">
                    {project.domain}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {project.title || project.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{project.durationWeeks || '?'}w</span>
            </div>
          </div>

          {/* Explanation from ML */}
          {project.explanation && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {project.explanation}
            </p>
          )}

          {/* Skills Required - ML data mapping */}
          {(project.skills || project.technologies) && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Skills required:
              </p>
              <div className="flex flex-wrap gap-2">
                {(project.skills || project.technologies).slice(0, isExpanded ? undefined : 3).map((skill, i) => (
                  <span 
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  >
                    {skill}
                  </span>
                ))}
                {!isExpanded && (project.skills || project.technologies).length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{(project.skills || project.technologies).length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpandedCard(isExpanded ? null : `project-${index}`)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show more'}
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-colors">
              <FolderGit2 className="w-4 h-4" />
              Start Project
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-400 rounded-xl transition-colors">
              <Star className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projects ({projects.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'courses' ? (
          <motion.div
            key="courses"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <CourseCard key={course.id || index} course={course} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                <p className="text-gray-500">
                  {searchQuery || difficultyFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Complete your profile to get personalized course recommendations'}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard key={project.id || index} project={project} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FolderGit2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-500">
                  {searchQuery || difficultyFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Complete your profile to get personalized project recommendations'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">How We Recommend</h3>
            <p className="text-gray-400">
              Our AI analyzes your current skills, education background, and target role to recommend 
              the most relevant learning resources. Courses are selected based on skill gaps, while 
              projects help you apply what you've learned in real-world scenarios. Each recommendation 
              includes difficulty level and estimated duration to help you plan your learning journey.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
