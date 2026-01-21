import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, Target, Building2, Code2, Heart,
  BookOpen, FolderGit2, Award, Pencil, Plus, Trash2,
  Briefcase, MapPin, Calendar, Phone, X, Loader2, Check, ExternalLink
} from 'lucide-react';
import { useDashboardContext } from '../components/layout/DashboardLayout';
import profileService from '../services/profileService';
import api from '../services/api';

// Skill labels for converting boolean flags to display names
const skillLabels = {
  // Healthcare
  hasEhr: 'EHR Systems',
  hasHl7Fhir: 'HL7/FHIR',
  hasMedicalImaging: 'Medical Imaging',
  hasHealthcareSecurity: 'Healthcare Security',
  hasTelemedicine: 'Telemedicine',
  // Agriculture
  hasIotSensors: 'IoT Sensors',
  hasDroneOps: 'Drone Operations',
  hasPrecisionAg: 'Precision Agriculture',
  hasCropModeling: 'Crop Modeling',
  hasSoilAnalysis: 'Soil Analysis',
  // Urban
  hasGis: 'GIS',
  hasSmartGrid: 'Smart Grid',
  hasTrafficMgmt: 'Traffic Management',
  hasUrbanIot: 'Urban IoT',
  hasBuildingAuto: 'Building Automation',
  // Soft Skills
  hasCommunication: 'Communication',
  hasTeamwork: 'Teamwork',
  hasProblemSolving: 'Problem Solving',
  hasLeadership: 'Leadership',
};

const sectorSkills = {
  Healthcare: ['hasEhr', 'hasHl7Fhir', 'hasMedicalImaging', 'hasHealthcareSecurity', 'hasTelemedicine'],
  Agriculture: ['hasIotSensors', 'hasDroneOps', 'hasPrecisionAg', 'hasCropModeling', 'hasSoilAnalysis'],
  Urban: ['hasGis', 'hasSmartGrid', 'hasTrafficMgmt', 'hasUrbanIot', 'hasBuildingAuto'],
};

const softSkillKeys = ['hasCommunication', 'hasTeamwork', 'hasProblemSolving', 'hasLeadership'];

export default function ProfileSkillsPage() {
  const { dashboardData, refreshDashboardData, refreshKey } = useDashboardContext();
  
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalForm, setPersonalForm] = useState({ phone: '', gender: '', dob: '' });

  // Use correct field names from backend API
  const academicSummary = dashboardData?.academicSummary || {};
  const careerSummary = dashboardData?.careerSummary || {};
  const skillProfile = dashboardData?.skillProfile || {};
  const sector = careerSummary?.industrySector || 'Healthcare';

  // Extract technical and soft skills from skillProfile boolean flags
  const relevantTechnicalSkillKeys = sectorSkills[sector] || sectorSkills.Healthcare;
  const technicalSkillsList = relevantTechnicalSkillKeys
    .filter(key => skillProfile[key])
    .map(key => skillLabels[key]);
  const softSkillsList = softSkillKeys
    .filter(key => skillProfile[key])
    .map(key => skillLabels[key]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, projectsRes, certsRes, userRes] = await Promise.all([
        profileService.getCourses(),
        profileService.getProjects(),
        profileService.getCertifications(),
        api.get('/api/users/me'),
      ]);
      setCourses(coursesRes.courses || []);
      setProjects(projectsRes.projects || []);
      setCertifications(certsRes.certifications || []);
      setUserData(userRes.data);
      setPersonalForm({ 
        phone: userRes.data?.phone || '', 
        gender: userRes.data?.gender || '',
        dob: userRes.data?.dob || ''
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePersonal = async () => {
    setPersonalLoading(true);
    try {
      // Build request with only non-empty values
      const updateData = {};
      if (personalForm.phone) updateData.phone = personalForm.phone;
      if (personalForm.gender) updateData.gender = personalForm.gender;
      if (personalForm.dob) updateData.dob = personalForm.dob;
      
      const response = await api.put('/api/users/update-profile', updateData);
      setUserData(response.data);
      setEditingPersonal(false);
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setPersonalLoading(false);
    }
  };

  const handleAddCourse = async (data) => {
    setFormLoading(true);
    try {
      await profileService.addCourse(data);
      setShowCourseForm(false);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to add course:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await profileService.deleteCourse(id);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleAddProject = async (data) => {
    setFormLoading(true);
    try {
      await profileService.addProject(data);
      setShowProjectForm(false);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to add project:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await profileService.deleteProject(id);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleAddCertification = async (data) => {
    setFormLoading(true);
    try {
      await profileService.addCertification(data);
      setShowCertForm(false);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to add certification:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCertification = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await profileService.deleteCertification(id);
      await fetchData();
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to delete certification:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
            <User className="w-6 h-6 text-white" />
          </div>
          Profile & Skills
        </h1>
        <p className="text-gray-400">Manage your profile, skills, and track your learning progress.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Personal Info Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Personal Info</h3>
              {!editingPersonal ? (
                <button onClick={() => setEditingPersonal(true)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditingPersonal(false)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={handleUpdatePersonal} disabled={personalLoading}
                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                    {personalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
                <span className="text-3xl font-bold text-white">{userData?.firstName?.[0]}{userData?.lastName?.[0]}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{userData?.firstName} {userData?.lastName}</h2>
              <p className="text-gray-400 text-sm">{userData?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <User className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Full Name</p>
                  <p className="text-white text-sm font-medium">{userData?.firstName} {userData?.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <Calendar className="w-5 h-5 text-purple-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Date of Birth</p>
                  {editingPersonal ? (
                    <input type="date" value={personalForm.dob}
                      onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm" />
                  ) : (
                    <p className="text-white text-sm font-medium">{userData?.dob ? formatDate(userData.dob) : 'Not set'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <Phone className="w-5 h-5 text-green-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Phone Number</p>
                  {editingPersonal ? (
                    <input type="tel" value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      placeholder="+1 234 567 8900" />
                  ) : (
                    <p className="text-white text-sm font-medium">{userData?.phone || 'Not set'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <User className="w-5 h-5 text-pink-400" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Gender</p>
                  {editingPersonal ? (
                    <select value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-white text-sm font-medium capitalize">{userData?.gender?.toLowerCase().replace('_', ' ') || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Education</h3>
            </div>
            {academicSummary.educationLevel || academicSummary.fieldOfStudy ? (
              <div className="space-y-2">
                <p className="text-white font-medium">{academicSummary.educationLevel}</p>
                <p className="text-gray-400 text-sm">{academicSummary.fieldOfStudy}</p>
                {academicSummary.institution && <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{academicSummary.institution}</p>}
                {academicSummary.cgpaPercentage > 0 && <span className="inline-block text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Score: {academicSummary.cgpaPercentage}%</span>}
              </div>
            ) : <p className="text-gray-500 text-sm">No education details added</p>}
          </motion.div>

          {/* Career Goals Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Career Goals</h3>
            </div>
            {careerSummary.targetJobRole || careerSummary.industrySector ? (
              <div className="space-y-3">
                {careerSummary.targetJobRole && <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400" /><span className="text-white">{careerSummary.targetJobRole}</span></div>}
                {careerSummary.industrySector && <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-green-400" /><span className="text-white">{careerSummary.industrySector}</span></div>}
              </div>
            ) : <p className="text-gray-500 text-sm">No career goals set</p>}
          </motion.div>

          {/* Technical Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div><h3 className="text-lg font-semibold text-white">Technical Skills</h3><p className="text-gray-400 text-sm">{technicalSkillsList.length} skills</p></div>
            </div>
            {technicalSkillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technicalSkillsList.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm">No technical skills added</p>}
          </motion.div>

          {/* Soft Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div><h3 className="text-lg font-semibold text-white">Soft Skills</h3><p className="text-gray-400 text-sm">{softSkillsList.length} skills</p></div>
            </div>
            {softSkillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {softSkillsList.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm">No soft skills added</p>}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div><h3 className="text-lg font-semibold text-white">Courses Completed</h3><p className="text-gray-400 text-sm">{courses.length} courses</p></div>
              </div>
              <button onClick={() => setShowCourseForm(!showCourseForm)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                <Plus className="w-4 h-4" />Add Course
              </button>
            </div>
            <AnimatePresence>
              {showCourseForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                  <CourseForm onSave={handleAddCourse} onCancel={() => setShowCourseForm(false)} loading={formLoading} />
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
            ) : courses.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 group hover:border-blue-500/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{course.courseName}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        {course.platform && <span>{course.platform}</span>}
                        {course.grade && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Grade: {course.grade}%</span>}
                        {course.completionDate && <span className="text-gray-500">{formatDate(course.completionDate)}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No courses added yet</p><p className="text-sm">Add your completed courses to track progress</p>
              </div>
            )}
          </motion.div>

          {/* Projects Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5 text-purple-400" />
                </div>
                <div><h3 className="text-lg font-semibold text-white">Projects Built</h3><p className="text-gray-400 text-sm">{projects.length} projects</p></div>
              </div>
              <button onClick={() => setShowProjectForm(!showProjectForm)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                <Plus className="w-4 h-4" />Add Project
              </button>
            </div>
            <AnimatePresence>
              {showProjectForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                  <ProjectForm onSave={handleAddProject} onCancel={() => setShowProjectForm(false)} loading={formLoading} />
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-purple-400 animate-spin" /></div>
            ) : projects.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 group hover:border-purple-500/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{project.projectTitle}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${project.complexityLevel === 3 ? 'bg-red-500/20 text-red-400' : project.complexityLevel === 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                          {project.complexityLevel === 3 ? 'Advanced' : project.complexityLevel === 2 ? 'Intermediate' : 'Beginner'}
                        </span>
                        <span className="text-gray-400 truncate">{project.domainSkills}</span>
                      </div>
                      {(project.githubUrl || project.demoUrl) && (
                        <div className="flex gap-2 mt-2">
                          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />GitHub</a>}
                          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />Demo</a>}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderGit2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No projects added yet</p><p className="text-sm">Add your built projects to showcase skills</p>
              </div>
            )}
          </motion.div>

          {/* Certifications Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div><h3 className="text-lg font-semibold text-white">Certifications</h3><p className="text-gray-400 text-sm">{certifications.length} certifications</p></div>
              </div>
              <button onClick={() => setShowCertForm(!showCertForm)}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm">
                <Plus className="w-4 h-4" />Add Certification
              </button>
            </div>
            <AnimatePresence>
              {showCertForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                  <CertificationForm onSave={handleAddCertification} onCancel={() => setShowCertForm(false)} loading={formLoading} />
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-yellow-400 animate-spin" /></div>
            ) : certifications.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 group hover:border-yellow-500/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{cert.certificationName}</p>
                      {cert.issuingOrganization && <p className="text-gray-400 text-sm mt-1">{cert.issuingOrganization}</p>}
                    </div>
                    <button onClick={() => handleDeleteCertification(cert.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No certifications added yet</p><p className="text-sm">Add your certifications to build credibility</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CourseForm({ onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({ courseName: '', grade: '', platform: '', completionDate: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, grade: parseFloat(formData.grade) || 0 }); };
  return (
    <div className="p-4 bg-gray-900/50 rounded-xl border border-blue-500/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Course Name *</label>
            <input type="text" value={formData.courseName} onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="e.g., Machine Learning Fundamentals" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Platform</label>
            <input type="text" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="Coursera, Udemy, etc." />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Grade (0-100) *</label>
            <input type="number" min="0" max="100" step="0.1" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="85" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Completion Date</label>
            <input type="date" value={formData.completionDate} onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}Add Course
          </button>
        </div>
      </form>
    </div>
  );
}

function ProjectForm({ onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({ projectTitle: '', domainSkills: '', complexityLevel: 1, githubUrl: '', demoUrl: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, complexityLevel: parseInt(formData.complexityLevel) }); };
  return (
    <div className="p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Project Title *</label>
            <input type="text" value={formData.projectTitle} onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="e.g., Smart Traffic System" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Complexity Level *</label>
            <select value={formData.complexityLevel} onChange={(e) => setFormData({ ...formData, complexityLevel: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm">
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Domain Skills (comma-separated) *</label>
          <input type="text" value={formData.domainSkills} onChange={(e) => setFormData({ ...formData, domainSkills: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="Python, Machine Learning, IoT" required />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
            <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Demo URL</label>
            <input type="url" value={formData.demoUrl} onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="https://..." />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}Add Project
          </button>
        </div>
      </form>
    </div>
  );
}

function CertificationForm({ onSave, onCancel, loading }) {
  const [certificationName, setCertificationName] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ certificationName }); };
  return (
    <div className="p-4 bg-gray-900/50 rounded-xl border border-yellow-500/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Certification Name *</label>
          <input type="text" value={certificationName} onChange={(e) => setCertificationName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" placeholder="e.g., AWS Solutions Architect" required />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}Add Certification
          </button>
        </div>
      </form>
    </div>
  );
}
