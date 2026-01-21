import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import onboardingService from '../services/onboardingService';

// Create Auth Context
const AuthContext = createContext(null);

// Sector theme configurations
const sectorThemes = {
  Healthcare: {
    primary: 'blue-500',
    secondary: 'blue-100',
    gradient: 'from-blue-400 to-indigo-500',
    bgGradient: {
      primary: 'rgba(59, 130, 246, 0.12)',
      secondary: 'rgba(167, 139, 250, 0.10)',
      tertiary: 'rgba(96, 165, 250, 0.08)',
    },
  },
  Agriculture: {
    primary: 'green-500',
    secondary: 'green-100',
    gradient: 'from-green-400 to-emerald-500',
    bgGradient: {
      primary: 'rgba(16, 185, 129, 0.12)',
      secondary: 'rgba(52, 211, 153, 0.10)',
      tertiary: 'rgba(74, 222, 128, 0.08)',
    },
  },
  Urban: {
    primary: 'indigo-500',
    secondary: 'indigo-100',
    gradient: 'from-indigo-400 to-purple-500',
    bgGradient: {
      primary: 'rgba(99, 102, 241, 0.12)',
      secondary: 'rgba(129, 140, 248, 0.10)',
      tertiary: 'rgba(165, 180, 252, 0.08)',
    },
  },
};

/**
 * Auth Provider Component
 * Manages authentication state and provides auth functions to the app
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentSector, setCurrentSector] = useState('Healthcare');
  const [sectorTheme, setSectorTheme] = useState(sectorThemes.Healthcare);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Check onboarding status
          try {
            const status = await onboardingService.getStatus();
            setHasCompletedOnboarding(status.onboardingCompleted || false);
          } catch (err) {
            console.error('Failed to check onboarding status:', err);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    setUser({
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
      isVerified: response.isVerified,
    });
    setIsAuthenticated(true);
    
    // Check onboarding status after login
    try {
      const status = await onboardingService.getStatus();
      setHasCompletedOnboarding(status.onboardingCompleted || false);
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    }
    
    return response;
  }, []);

  // Signup function
  const signup = useCallback(async (userData) => {
    const response = await authService.signup(userData);
    return response;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setCurrentSector('Healthcare');
    setSectorTheme(sectorThemes.Healthcare);
  }, []);

  // Update sector and theme
  const updateSector = useCallback((sector) => {
    setCurrentSector(sector);
    setSectorTheme(sectorThemes[sector] || sectorThemes.Healthcare);
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async (formData) => {
    const transformedData = onboardingService.transformFormData(formData);
    const response = await onboardingService.submit(transformedData);
    setHasCompletedOnboarding(true);
    
    // Update sector based on submitted data
    if (formData.sector) {
      updateSector(formData.sector);
    }
    
    return response;
  }, [updateSector]);

  // Check onboarding status
  const checkOnboardingStatus = useCallback(async () => {
    try {
      const status = await onboardingService.getStatus();
      setHasCompletedOnboarding(status.onboardingCompleted || false);
      return status;
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return { onboardingCompleted: false };
    }
  }, []);

  // Google OAuth login
  const loginWithGoogle = useCallback(() => {
    authService.loginWithGoogle();
  }, []);

  const value = {
    // State
    isAuthenticated,
    user,
    loading,
    hasCompletedOnboarding,
    currentSector,
    sectorTheme,
    
    // Functions
    login,
    signup,
    logout,
    updateSector,
    completeOnboarding,
    checkOnboardingStatus,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
