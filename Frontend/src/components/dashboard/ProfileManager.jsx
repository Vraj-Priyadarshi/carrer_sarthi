import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Pencil, Trash2, BookOpen, FolderGit2, Award, Loader2 } from 'lucide-react';
import profileService from '../../services/profileService';

// Course Form Component
function CourseForm({ course, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    courseName: course?.courseName || '',
    grade: course?.grade || '',
    platform: course?.platform || '',
    completionDate: course?.completionDate || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      grade: parseFloat(formData.grade) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Course Name *</label>
        <input
          type="text"
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Machine Learning Fundamentals"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Grade (0-100) *</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="85"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Platform</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Coursera, Udemy, etc."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Completion Date</label>
        <input
          type="date"
          value={formData.completionDate}
          onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {course ? 'Update' : 'Add'} Course
        </button>
      </div>
    </form>
  );
}

// Project Form Component
function ProjectForm({ project, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    projectTitle: project?.projectTitle || '',
    domainSkills: project?.domainSkills || '',
    complexityLevel: project?.complexityLevel || 1,
    description: project?.description || '',
    githubUrl: project?.githubUrl || '',
    demoUrl: project?.demoUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      complexityLevel: parseInt(formData.complexityLevel),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Project Title *</label>
        <input
          type="text"
          value={formData.projectTitle}
          onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Smart Traffic Management System"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Domain Skills (comma-separated) *</label>
        <input
          type="text"
          value={formData.domainSkills}
          onChange={(e) => setFormData({ ...formData, domainSkills: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Python, Machine Learning, IoT"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Complexity Level *</label>
        <select
          value={formData.complexityLevel}
          onChange={(e) => setFormData({ ...formData, complexityLevel: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={1}>Beginner</option>
          <option value={2}>Intermediate</option>
          <option value={3}>Advanced</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Brief description of your project..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Demo URL</label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {project ? 'Update' : 'Add'} Project
        </button>
      </div>
    </form>
  );
}

// Certification Form Component
function CertificationForm({ certification, onSave, onCancel, loading }) {
  const [certificationName, setCertificationName] = useState(certification?.certificationName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ certificationName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Certification Name *</label>
        <input
          type="text"
          value={certificationName}
          onChange={(e) => setCertificationName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., AWS Solutions Architect"
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Certification
        </button>
      </div>
    </form>
  );
}

// Item Card Component
function ItemCard({ item, type, onEdit, onDelete }) {
  const getIcon = () => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4 text-yellow-400" />;
      case 'project': return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      case 'certification': return <Award className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'course': return item.courseName;
      case 'project': return item.projectTitle;
      case 'certification': return item.certificationName;
      default: return '';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'course': 
        return `${item.platform || 'Self-study'} • Grade: ${item.grade}%`;
      case 'project': 
        const levels = ['', 'Beginner', 'Intermediate', 'Advanced'];
        return `${levels[item.complexityLevel]} • ${item.domainSkills}`;
      case 'certification': 
        return item.isActive ? 'Active' : 'Expired';
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg group hover:bg-gray-700 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {getIcon()}
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{getTitle()}</p>
          <p className="text-gray-400 text-xs truncate">{getSubtitle()}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {type !== 'certification' && (
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(item)}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Main Profile Manager Component
export default function ProfileManager({ isOpen, onClose, onDataChanged }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Handle recalculation - close modal and trigger dashboard refresh
  const triggerRecalculation = async () => {
    console.log('[ProfileManager] triggerRecalculation called');
    setIsRecalculating(true);
    onClose(); // Close the modal
    console.log('[ProfileManager] Modal closed, calling onDataChanged...');
    try {
      if (onDataChanged) {
        console.log('[ProfileManager] Awaiting onDataChanged()...');
        await onDataChanged(); // This will refresh dashboard with ML calls
        console.log('[ProfileManager] onDataChanged() completed');
      } else {
        console.warn('[ProfileManager] onDataChanged is not defined!');
      }
    } catch (err) {
      console.error('[ProfileManager] Error in onDataChanged:', err);
    } finally {
      setIsRecalculating(false);
      console.log('[ProfileManager] Recalculation finished');
    }
  };

  // Fetch data when modal opens
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, projectsRes, certsRes] = await Promise.all([
        profileService.getCourses(),
        profileService.getProjects(),
        profileService.getCertifications(),
      ]);
      setCourses(coursesRes.courses || []);
      setProjects(projectsRes.projects || []);
      setCertifications(certsRes.certifications || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSaveCourse = async (data) => {
    setFormLoading(true);
    setError('');
    try {
      if (editingItem) {
        await profileService.updateCourse(editingItem.id, data);
      } else {
        await profileService.addCourse(data);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormLoading(false);
      // Trigger recalculation which closes modal and refreshes dashboard
      await triggerRecalculation();
    } catch (err) {
      console.error('Failed to save course:', err);
      setError(err.response?.data?.message || 'Failed to save course');
      setFormLoading(false);
    }
  };

  const handleSaveProject = async (data) => {
    setFormLoading(true);
    setError('');
    try {
      if (editingItem) {
        await profileService.updateProject(editingItem.id, data);
      } else {
        await profileService.addProject(data);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormLoading(false);
      // Trigger recalculation which closes modal and refreshes dashboard
      await triggerRecalculation();
    } catch (err) {
      console.error('Failed to save project:', err);
      setError(err.response?.data?.message || 'Failed to save project');
      setFormLoading(false);
    }
  };

  const handleSaveCertification = async (data) => {
    setFormLoading(true);
    setError('');
    try {
      await profileService.addCertification(data);
      setShowForm(false);
      setFormLoading(false);
      // Trigger recalculation which closes modal and refreshes dashboard
      await triggerRecalculation();
    } catch (err) {
      console.error('Failed to save certification:', err);
      setError(err.response?.data?.message || 'Failed to save certification');
      setFormLoading(false);
    }
  };

  const handleDelete = async (type, item) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    console.log(`[ProfileManager] Deleting ${type}:`, item.id);
    setError('');
    try {
      switch (type) {
        case 'course':
          console.log('[ProfileManager] Calling profileService.deleteCourse...');
          await profileService.deleteCourse(item.id);
          console.log('[ProfileManager] Course deleted successfully');
          break;
        case 'project':
          console.log('[ProfileManager] Calling profileService.deleteProject...');
          await profileService.deleteProject(item.id);
          console.log('[ProfileManager] Project deleted successfully');
          break;
        case 'certification':
          console.log('[ProfileManager] Calling profileService.deleteCertification...');
          await profileService.deleteCertification(item.id);
          console.log('[ProfileManager] Certification deleted successfully');
          break;
      }
      // Trigger recalculation which closes modal and refreshes dashboard
      console.log('[ProfileManager] Calling triggerRecalculation...');
      await triggerRecalculation();
    } catch (err) {
      console.error(`[ProfileManager] Failed to delete ${type}:`, err);
      setError(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length, color: 'yellow' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length, color: 'purple' },
    { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length, color: 'orange' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      );
    }

    if (showForm) {
      switch (activeTab) {
        case 'courses':
          return (
            <CourseForm
              course={editingItem}
              onSave={handleSaveCourse}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              loading={formLoading}
            />
          );
        case 'projects':
          return (
            <ProjectForm
              project={editingItem}
              onSave={handleSaveProject}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              loading={formLoading}
            />
          );
        case 'certifications':
          return (
            <CertificationForm
              certification={editingItem}
              onSave={handleSaveCertification}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              loading={formLoading}
            />
          );
      }
    }

    const items = activeTab === 'courses' ? courses : activeTab === 'projects' ? projects : certifications;
    
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No {activeTab} added yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add your first {activeTab.slice(0, -1)}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            type={activeTab.slice(0, -1)}
            onEdit={handleEdit}
            onDelete={(item) => handleDelete(activeTab.slice(0, -1), item)}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Manage Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowForm(false); setEditingItem(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `text-${tab.color}-400 border-b-2 border-${tab.color}-400 bg-${tab.color}-500/10`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? `bg-${tab.color}-500/20` : 'bg-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {renderContent()}
          </div>

          {/* Footer - Add Button */}
          {!showForm && !loading && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => { setShowForm(true); setEditingItem(null); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
