import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Plus, X, Github, ExternalLink, Code2 } from 'lucide-react';

const complexityLevels = [
  { value: 1, label: 'Beginner', description: 'Learning project, basic implementation' },
  { value: 2, label: 'Intermediate', description: 'Multiple features, some complexity' },
  { value: 3, label: 'Advanced', description: 'Production-level, complex architecture' },
];

export default function ProjectsStep({ formData, updateFormData }) {
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    projectTitle: '',
    domainSkills: '',
    complexityLevel: 2,
    description: '',
    githubUrl: '',
    demoUrl: '',
  });

  const handleAddProject = () => {
    if (newProject.projectTitle && newProject.domainSkills) {
      updateFormData('projects', [...formData.projects, { ...newProject }]);
      setNewProject({
        projectTitle: '',
        domainSkills: '',
        complexityLevel: 2,
        description: '',
        githubUrl: '',
        demoUrl: '',
      });
      setShowForm(false);
    }
  };

  const handleRemoveProject = (index) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    updateFormData('projects', updated);
  };

  const getComplexityColor = (level) => {
    switch (level) {
      case 1: return 'bg-green-500/20 text-green-400';
      case 2: return 'bg-yellow-500/20 text-yellow-400';
      case 3: return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <FolderGit2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Your Projects
        </h2>
        <p className="text-gray-400">
          Showcase projects relevant to {formData.industrySector || 'your sector'}
        </p>
      </div>

      {/* Existing Projects */}
      {formData.projects.length > 0 && (
        <div className="space-y-3 mb-6">
          {formData.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{project.projectTitle}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getComplexityColor(project.complexityLevel)}`}>
                      {complexityLevels.find(c => c.value === project.complexityLevel)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    <Code2 className="w-3 h-3 inline mr-1" />
                    {project.domainSkills}
                  </p>
                  {project.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Demo
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProject(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Project Form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-4"
        >
          <h4 className="font-medium text-white mb-4">Add New Project</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Project Title *</label>
              <input
                type="text"
                value={newProject.projectTitle}
                onChange={(e) => setNewProject({ ...newProject, projectTitle: e.target.value })}
                placeholder="e.g., Smart Health Monitoring System"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Domain Skills Used *</label>
              <input
                type="text"
                value={newProject.domainSkills}
                onChange={(e) => setNewProject({ ...newProject, domainSkills: e.target.value })}
                placeholder="e.g., Python, Machine Learning, IoT"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated list of skills</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Complexity Level *</label>
              <div className="grid grid-cols-3 gap-2">
                {complexityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setNewProject({ ...newProject, complexityLevel: level.value })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      newProject.complexityLevel === level.value
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{level.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Brief description of the project..."
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Demo URL</label>
                <input
                  type="url"
                  value={newProject.demoUrl}
                  onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                disabled={!newProject.projectTitle || !newProject.domainSkills}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Add Project
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
          Add a Project
        </button>
      )}

      <p className="text-center text-gray-500 mt-6 text-sm">
        {formData.projects.length === 0 
          ? "This step is optional - you can skip if you don't have relevant projects yet"
          : `${formData.projects.length} project${formData.projects.length !== 1 ? 's' : ''} added`
        }
      </p>
    </div>
  );
}
