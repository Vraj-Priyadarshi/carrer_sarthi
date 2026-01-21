import { motion } from 'framer-motion';
import { User, GraduationCap, Target, Briefcase, BookOpen, FolderGit2, Award, Plus } from 'lucide-react';

export default function ProfileSummary({ dashboardData, onManageProfile }) {
  // Use backend field names: academicSummary, careerSummary, learningProgress
  const academicSummary = dashboardData?.academicSummary || {};
  const careerSummary = dashboardData?.careerSummary || {};
  const learningProgress = dashboardData?.learningProgress || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Profile Summary</h3>
            <p className="text-gray-400 text-sm">Your academic & career details</p>
          </div>
        </div>
        {onManageProfile && (
          <button
            onClick={onManageProfile}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Manage Profile"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Education */}
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Education</p>
            <p className="text-white">
              {academicSummary.educationLevel || 'Not specified'}
            </p>
            {academicSummary.fieldOfStudy && (
              <p className="text-sm text-gray-500">{academicSummary.fieldOfStudy}</p>
            )}
            {academicSummary.cgpaPercentage > 0 && (
              <p className="text-xs text-gray-600">
                CGPA/Score: {academicSummary.cgpaPercentage}
              </p>
            )}
          </div>
        </div>

        {/* Target Role */}
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Target Role</p>
            <p className="text-white">{careerSummary.targetJobRole || 'Not specified'}</p>
          </div>
        </div>

        {/* Industry */}
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Industry Sector</p>
            <p className="text-white">{careerSummary.industrySector || 'Not specified'}</p>
          </div>
        </div>

        {/* Quick Stats - Clickable */}
        <div className="pt-4 border-t border-gray-700/50">
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={onManageProfile}
              className="text-center p-2 bg-gray-900/50 rounded-lg hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent transition-all group"
            >
              <BookOpen className="w-4 h-4 text-yellow-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-lg font-bold text-white">{learningProgress.totalCourses || 0}</p>
              <p className="text-xs text-gray-500 group-hover:text-yellow-400">Courses</p>
            </button>
            <button 
              onClick={onManageProfile}
              className="text-center p-2 bg-gray-900/50 rounded-lg hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all group"
            >
              <FolderGit2 className="w-4 h-4 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-lg font-bold text-white">{learningProgress.totalProjects || 0}</p>
              <p className="text-xs text-gray-500 group-hover:text-purple-400">Projects</p>
            </button>
            <button 
              onClick={onManageProfile}
              className="text-center p-2 bg-gray-900/50 rounded-lg hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all group"
            >
              <Award className="w-4 h-4 text-orange-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-lg font-bold text-white">{learningProgress.totalCertifications || 0}</p>
              <p className="text-xs text-gray-500 group-hover:text-orange-400">Certs</p>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Click to add or manage</p>
        </div>
      </div>
    </motion.div>
  );
}
