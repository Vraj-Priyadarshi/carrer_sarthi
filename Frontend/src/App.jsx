import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute, OnboardingRoute } from './components/common/ProtectedRoute';

// Layout
import { DashboardLayout } from './components/layout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import OAuth2RedirectPage from './pages/OAuth2RedirectPage';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Dashboard Pages (Protected - require auth & completed onboarding)
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import SkillProgressionPage from './pages/SkillProgressionPage';
import CareerPathwayPage from './pages/CareerPathwayPage';
import LearningProjectsPage from './pages/LearningProjectsPage';
import ProfileSkillsPage from './pages/ProfileSkillsPage';
import AIInsightsPage from './pages/AIInsightsPage';

/**
 * App Component
 * Main routing configuration for the Career Intelligence Dashboard
 * 
 * Route Structure:
 * - Public: Landing, Login, Signup, Email Verification
 * - Onboarding: Initial profile setup (requires auth, not completed onboarding)
 * - Dashboard: All dashboard pages (requires auth & completed onboarding)
 *   - /dashboard - Overview with quick stats
 *   - /skills - Skill progression with radar chart
 *   - /pathway - Career pathway timeline
 *   - /learning - Courses and projects
 *   - /profile - Profile and skills management
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />

          {/* OAuth2 Redirect Handler - must be public */}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

          {/* Email Verification Route - public */}
          <Route path="/verify" element={<VerifyEmailPage />} />

          {/* Password Reset Routes - public */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ========== ONBOARDING ROUTE ========== */}
          {/* Requires auth but NOT completed onboarding */}
          <Route 
            path="/onboarding" 
            element={
              <OnboardingRoute>
                <OnboardingPage />
              </OnboardingRoute>
            } 
          />

          {/* ========== PROTECTED DASHBOARD ROUTES ========== */}
          {/* All nested under DashboardLayout for shared state & navbar */}
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Overview - Main landing page */}
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            
            {/* Skill Progression - Radar chart & gap analysis */}
            <Route path="/skills" element={<SkillProgressionPage />} />
            
            {/* Career Pathway - Timeline visualization */}
            <Route path="/pathway" element={<CareerPathwayPage />} />
            
            {/* Learning Hub - Courses & Projects */}
            <Route path="/learning" element={<LearningProjectsPage />} />
            
            {/* AI Market Insights - AI-powered career intelligence */}
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            
            {/* Profile & Skills - User profile management */}
            <Route path="/profile" element={<ProfileSkillsPage />} />
          </Route>

          {/* ========== CATCH-ALL REDIRECT ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;