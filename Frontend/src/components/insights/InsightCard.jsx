import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * InsightCard Component
 * Displays a single AI-generated career insight with visual emphasis
 * 
 * Features:
 * - Icon based on insight type
 * - Animated entrance
 * - Collapsible "why overlooked" section
 * - Priority badge for first insight
 * - Hover effects and color accents
 */

// Map insight types to icons and colors
const INSIGHT_TYPE_CONFIG = {
  'Market-Weighted Skill Priority': {
    icon: '🔥',
    color: 'orange',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    borderColor: 'border-orange-500/30',
    accentColor: 'text-orange-400',
    chipBg: 'bg-orange-500/20',
    chipText: 'text-orange-300',
  },
  'Course vs Project Market ROI': {
    icon: '📈',
    color: 'green',
    bgGradient: 'from-green-500/20 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    accentColor: 'text-green-400',
    chipBg: 'bg-green-500/20',
    chipText: 'text-green-300',
  },
  'Interview Risk Alert': {
    icon: '⚠️',
    color: 'yellow',
    bgGradient: 'from-yellow-500/20 to-amber-500/10',
    borderColor: 'border-yellow-500/30',
    accentColor: 'text-yellow-400',
    chipBg: 'bg-yellow-500/20',
    chipText: 'text-yellow-300',
  },
  'Skill Timing & Freshness': {
    icon: '⏱️',
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
    chipBg: 'bg-blue-500/20',
    chipText: 'text-blue-300',
  },
  'Adjacent Market Opportunity': {
    icon: '🧭',
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-400',
    chipBg: 'bg-purple-500/20',
    chipText: 'text-purple-300',
  },
};

// Default config for unknown insight types
const DEFAULT_CONFIG = {
  icon: '💡',
  color: 'blue',
  bgGradient: 'from-blue-500/20 to-indigo-500/10',
  borderColor: 'border-blue-500/30',
  accentColor: 'text-blue-400',
  chipBg: 'bg-blue-500/20',
  chipText: 'text-blue-300',
};

export default function InsightCard({ insight, index = 0, isPriority = false }) {
  // Get styling config based on insight type
  const config = INSIGHT_TYPE_CONFIG[insight.insight_type] || DEFAULT_CONFIG;

  // Animation variants for staggered entrance
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`
        relative bg-gradient-to-br ${config.bgGradient} 
        border ${config.borderColor} rounded-2xl p-6
        hover:shadow-lg hover:shadow-${config.color}-500/10
        transition-all duration-300 group
      `}
    >
      {/* Priority Badge - shown only for first/most important insight */}
      {isPriority && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
        >
          ⭐ TOP PRIORITY
        </motion.div>
      )}

      {/* Card Header: Icon + Type Chip + Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Large Icon */}
        <div className={`
          w-14 h-14 rounded-xl bg-gray-800/50 border ${config.borderColor}
          flex items-center justify-center text-2xl
          group-hover:scale-110 transition-transform duration-300
        `}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Insight Type Chip */}
          <span className={`
            inline-block ${config.chipBg} ${config.chipText}
            text-xs font-medium px-3 py-1 rounded-full mb-2
            border ${config.borderColor}
          `}>
            {insight.insight_type}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-white leading-tight">
            {insight.title}
          </h3>
        </div>
      </div>

      {/* Main Insight Text */}
      <div className="mb-4">
        <p className="text-gray-300 leading-relaxed">
          {insight.insight}
        </p>
      </div>

      {/* Why It's Overlooked - Subtle section */}
      {insight.why_it_is_overlooked && (
        <div className="mb-4 pl-4 border-l-2 border-gray-700">
          <p className="text-sm text-gray-500 italic">
            <span className="text-gray-400 not-italic font-medium">Often missed: </span>
            {insight.why_it_is_overlooked}
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-700/50 my-4"></div>

      {/* Recommended Action - Highlighted */}
      <div className={`
        bg-gray-800/50 rounded-xl p-4 border ${config.borderColor}
      `}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-lg ${config.accentColor}`}>→</span>
          <span className={`text-sm font-semibold ${config.accentColor} uppercase tracking-wide`}>
            Recommended Action
          </span>
        </div>
        <p className="text-white font-medium">
          {insight.recommended_action}
        </p>
      </div>

      {/* Subtle hover glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${config.bgGradient}
        pointer-events-none transition-opacity duration-300 -z-10 blur-xl
      `}></div>
    </motion.div>
  );
}

InsightCard.propTypes = {
  insight: PropTypes.shape({
    insight_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    insight: PropTypes.string.isRequired,
    why_it_is_overlooked: PropTypes.string,
    recommended_action: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
  isPriority: PropTypes.bool,
};
