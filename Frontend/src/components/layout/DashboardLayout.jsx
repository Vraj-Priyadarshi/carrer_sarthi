import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import Navbar from './Navbar';
import { AnimatedBackground } from '../common/AnimatedBackground';
import dashboardService from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard Context
 * Shares dashboard data across all dashboard pages
 * This allows the navbar pages to access ML data without refetching
 */
const DashboardContext = createContext(null);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardLayout');
  }
  return context;
};

/**
 * DashboardLayout Component
 * Wrapper for all dashboard pages
 * - Provides shared state (dashboardData, mlData)
 * - Renders Navbar
 * - Handles loading states and refresh functionality
 */
export default function DashboardLayout() {
  const [dashboardData, setDashboardData] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { user, sectorTheme, currentSector } = useAuth();

  // Fetch dashboard data on mount
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
      
      // Extract ML data from response
      const extractedMlData = dashboardService.extractMLData(data);
      setMlData(extractedMlData);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard data (after profile changes)
  const refreshDashboardData = async () => {
    console.log('[DashboardLayout] Starting refresh');
    setIsRefreshing(true);
    
    try {
      // Wait for backend to process changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await dashboardService.getDashboard();
      const extractedMlData = dashboardService.extractMLData(data);
      
      setDashboardData(data);
      setMlData(extractedMlData);
      setRefreshKey(prev => prev + 1);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[DashboardLayout] Refresh complete');
    } catch (err) {
      console.error('[DashboardLayout] Refresh failed:', err);
      setError('Failed to update predictions. Please refresh the page.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full animate-ping"></div>
              </div>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-white text-lg font-medium mb-2">Loading Your Dashboard</p>
            <p className="text-gray-400 text-sm">Fetching AI-powered recommendations...</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  // Context value to share with child pages
  const contextValue = {
    dashboardData,
    mlData,
    error,
    refreshKey,
    isRefreshing,
    user,
    sectorTheme,
    currentSector,
    refreshDashboardData,
    fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <AnimatedBackground>
        <div className="min-h-screen">
          {/* Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="pt-20 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between"
                >
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={fetchDashboardData}
                    className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </motion.div>
              )}

              {/* Page Content - Rendered via React Router Outlet */}
              <Outlet />
            </div>
          </main>

          {/* Recalculating ML Predictions Overlay */}
          {isRefreshing && (
            <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
                  </div>
                  <div className="relative w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Recalculating Your Skill Path
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-4">
                  Our AI models are analyzing your updated profile to provide fresh recommendations...
                </p>
                
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Updating skill gap analysis & time to ready</span>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AnimatedBackground>
    </DashboardContext.Provider>
  );
}
