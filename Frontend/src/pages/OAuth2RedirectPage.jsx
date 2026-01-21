import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { GradientBackground } from '../components/common/AnimatedBackground';

const TOKEN_KEY = 'skillpath_token';
const USER_KEY = 'skillpath_user';

/**
 * OAuth2 Redirect Handler Page
 * Handles the redirect from backend after Google OAuth2 authentication
 * Extracts token from URL params and stores it
 */
export default function OAuth2RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing your login...');

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        // Extract parameters from URL
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const needsPassword = searchParams.get('needsPassword') === 'true';
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const error = searchParams.get('error');

        // Handle error case
        if (error) {
          console.error('OAuth2 error:', error);
          setStatus('error');
          setMessage(decodeURIComponent(error) || 'Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Validate token
        if (!token) {
          console.error('No token received from OAuth2');
          setStatus('error');
          setMessage('No authentication token received. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Decode JWT to get user info
        let userData = {};
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userData = {
            userId: payload.userId || payload.sub,
            email: email || payload.email || payload.sub,
            firstName: payload.firstName || null,
            lastName: payload.lastName || null,
            role: payload.role || 'USER',
            isVerified: true, // Google OAuth users are always verified
          };
        } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
          // Use basic info if decode fails
          userData = {
            email: email,
            isVerified: true,
          };
        }

        // Store token and user data
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        console.log('OAuth2 login successful:', { email, isNewUser, needsPassword });

        setStatus('success');
        setMessage('Login successful! Redirecting...');

        // Small delay to show success message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Force page reload to reinitialize auth context with new token
        // Then redirect based on user status
        if (isNewUser || needsPassword) {
          // New users need to complete onboarding
          window.location.href = '/onboarding';
        } else {
          // Check onboarding status by redirecting to dashboard
          // The protected route will handle redirection if onboarding not complete
          window.location.href = '/dashboard';
        }

      } catch (err) {
        console.error('OAuth2 redirect handling error:', err);
        setStatus('error');
        setMessage('An error occurred during authentication. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuth2Redirect();
  }, [searchParams, navigate]);

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">Career Saarthi</span>
          </div>

          {/* Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              {status === 'processing' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-16 h-16 text-blue-500" />
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <XCircle className="w-16 h-16 text-red-500" />
                </motion.div>
              )}
            </div>

            {/* Message */}
            <h2 className={`text-xl font-semibold mb-2 ${
              status === 'error' ? 'text-red-400' : 'text-white'
            }`}>
              {status === 'processing' && 'Authenticating...'}
              {status === 'success' && 'Welcome!'}
              {status === 'error' && 'Authentication Failed'}
            </h2>
            <p className="text-gray-400">{message}</p>

            {/* Error action */}
            {status === 'error' && (
              <motion.button
                onClick={() => navigate('/login')}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Return to Login
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </GradientBackground>
  );
}
