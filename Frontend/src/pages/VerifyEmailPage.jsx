import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';
import api from '../services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await api.get(`/api/auth/verify?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Your email has been verified successfully!');
        
        // Redirect to login after 7 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! Please login to continue.' }
          });
        }, 7000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Verifying State */}
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-2">
                Verifying Your Email
              </h1>
              <p className="text-gray-300">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-300 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Redirecting to login in 7 seconds...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Go to Login Now
              </Link>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-300 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Sign Up Again
                </Link>
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Having trouble?{' '}
          <a href="mailto:support@careersaarthi.com" className="text-purple-400 hover:text-purple-300">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
