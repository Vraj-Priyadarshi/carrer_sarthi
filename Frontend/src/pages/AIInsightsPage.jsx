import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InsightCard } from '../components/insights';
import { useDashboardContext } from '../components/layout/DashboardLayout';
import insightsService from '../services/insightsService';

/**
 * AIInsightsPage
 * 
 * Displays AI-generated market-aware career insights.
 * This page acts as an "executive briefing" or "career intelligence report"
 * showing why each insight matters and what action the user should take.
 * 
 * Data flow:
 * 1. Fetch dashboard data from context (contains skill gap + recommendations)
 * 2. Format the data for the insights API (Model-3)
 * 3. Call the insights API to generate AI insights
 * 4. Display insights in premium card format
 */
export default function AIInsightsPage() {
  // Get dashboard data from context
  const { dashboardData, mlData, refreshKey } = useDashboardContext();

  // Local state for insights
  const [insights, setInsights] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOverlooked, setShowAllOverlooked] = useState(false);

  /**
   * Fetch AI insights when component mounts or dashboard data changes
   */
  useEffect(() => {
    const fetchInsights = async () => {
      // Reset state
      setLoading(true);
      setError(null);

      try {
        // Check if we have the required data
        if (!dashboardData || !mlData) {
          console.log('[AIInsightsPage] Waiting for dashboard data...');
          return;
        }

        // Format the payload for the insights API
        const payload = insightsService.formatPayloadFromDashboard(dashboardData, mlData);
        console.log('[AIInsightsPage] Sending payload to insights API:', payload);

        // Call the insights API
        const response = await insightsService.generateInsights(payload);
        console.log('[AIInsightsPage] Received insights:', response);

        // Update state with insights
        if (response.success) {
          setInsights(response.insights || []);
          setMeta(response.meta || null);
        } else {
          throw new Error('Failed to generate insights');
        }
      } catch (err) {
        console.error('[AIInsightsPage] Error fetching insights:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load insights');
        
        // Try demo insights as fallback
        try {
          console.log('[AIInsightsPage] Trying demo insights as fallback...');
          const demoResponse = await insightsService.getDemoInsights();
          if (demoResponse.success) {
            setInsights(demoResponse.insights || []);
            setMeta({ ...demoResponse.meta, demo: true });
            setError(null);
          }
        } catch (demoErr) {
          console.error('[AIInsightsPage] Demo fallback also failed:', demoErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [dashboardData, mlData, refreshKey]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = insightsService.formatPayloadFromDashboard(dashboardData, mlData);
      const response = await insightsService.generateInsights(payload);
      
      if (response.success) {
        setInsights(response.insights || []);
        setMeta(response.meta || null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to refresh insights');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-6">
      {/* ============ META INFO BAR ============ */}
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-4"
          >
            {/* Target Role */}
            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Target Role:</span>
              <span className="text-white font-medium">{meta.target_role}</span>
            </div>

            {/* Skill Gap Score */}
            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Skill Gap:</span>
              <span className="text-white font-medium">{meta.skill_gap_score?.toFixed(1) || '--'}</span>
            </div>

            {/* Total Insights */}
            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Insights:</span>
              <span className="text-white font-medium">{meta.total_insights || insights.length}</span>
            </div>

            {/* Demo Badge */}
            {meta.demo && (
              <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-2">
                <span className="text-yellow-300 text-sm font-medium">Demo Data</span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="ml-auto flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </motion.div>
        )}

      {/* ============ LOADING STATE ============ */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 animate-pulse"></div>
              <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <p className="text-gray-400 mt-4 text-lg">Generating AI insights...</p>
            <p className="text-gray-500 text-sm mt-1">Analyzing market trends and your profile</p>
          </motion.div>
        )}

        {/* ============ ERROR STATE ============ */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Insights</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ============ EMPTY STATE ============ */}
        {!loading && !error && insights.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center"
          >
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Insights Available</h3>
            <p className="text-gray-400 mb-6">
              Complete your profile and skill assessment to get personalized AI insights.
            </p>
            <button
              onClick={handleRefresh}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Generate Insights
            </button>
          </motion.div>
        )}

        {/* ============ INSIGHTS GRID ============ */}
        {!loading && !error && insights.length > 0 && (
          <motion.div
            key="insights"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Map through insights and render InsightCard for each */}
            {insights.map((insight, index) => (
              <InsightCard
                key={`insight-${index}`}
                insight={insight}
                index={index}
                isPriority={index === 0} // First insight gets priority badge
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ FOOTER NOTE ============ */}
      {!loading && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8 border-t border-gray-800"
        >
          <p className="text-gray-500 text-sm">
            💡 These insights are generated by AI based on current market data and your profile.
            <br />
            Refresh periodically for the latest market intelligence.
          </p>
        </motion.div>
      )}
    </div>
  );
}
