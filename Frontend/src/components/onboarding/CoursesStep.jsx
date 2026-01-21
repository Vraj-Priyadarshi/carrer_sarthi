import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, X, Calendar, Award, Building } from 'lucide-react';

const platforms = [
  'Coursera',
  'Udemy',
  'edX',
  'LinkedIn Learning',
  'University',
  'YouTube',
  'Udacity',
  'Pluralsight',
  'Other',
];

export default function CoursesStep({ formData, updateFormData }) {
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    grade: '',
    platform: '',
    completionDate: '',
  });

  const handleAddCourse = () => {
    if (newCourse.courseName && newCourse.grade) {
      const course = {
        ...newCourse,
        grade: parseFloat(newCourse.grade),
        completionDate: newCourse.completionDate || null,
      };
      updateFormData('courses', [...formData.courses, course]);
      setNewCourse({ courseName: '', grade: '', platform: '', completionDate: '' });
      setShowForm(false);
    }
  };

  const handleRemoveCourse = (index) => {
    const updated = formData.courses.filter((_, i) => i !== index);
    updateFormData('courses', updated);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Courses & Learning
        </h2>
        <p className="text-gray-400">
          Add online courses or certifications you've completed
        </p>
      </div>

      {/* Existing Courses */}
      {formData.courses.length > 0 && (
        <div className="space-y-3 mb-6">
          {formData.courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{course.courseName}</h4>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                    {course.platform && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {course.platform}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Grade: {course.grade}%
                    </span>
                    {course.completionDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {course.completionDate}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCourse(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Course Form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-4"
        >
          <h4 className="font-medium text-white mb-4">Add New Course</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Course Name *</label>
              <input
                type="text"
                value={newCourse.courseName}
                onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                placeholder="e.g., Machine Learning Specialization"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platform</label>
                <select
                  value={newCourse.platform}
                  onChange={(e) => setNewCourse({ ...newCourse, platform: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select platform</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Grade (%) *</label>
                <input
                  type="number"
                  value={newCourse.grade}
                  onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                  placeholder="85"
                  min="0"
                  max="100"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Completion Date</label>
              <input
                type="date"
                value={newCourse.completionDate}
                onChange={(e) => setNewCourse({ ...newCourse, completionDate: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                disabled={!newCourse.courseName || !newCourse.grade}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Add Course
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add a Course
        </button>
      )}

      <p className="text-center text-gray-500 mt-6 text-sm">
        {formData.courses.length === 0 
          ? "This step is optional - you can skip if you haven't completed any relevant courses yet"
          : `${formData.courses.length} course${formData.courses.length !== 1 ? 's' : ''} added`
        }
      </p>
    </div>
  );
}
