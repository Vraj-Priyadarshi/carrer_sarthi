import { motion } from 'framer-motion';
import { Sparkles, Target, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: Target,
    title: 'Personalized Pathways',
    description: 'AI-driven recommendations tailored to your goals',
  },
  {
    icon: BookOpen,
    title: 'Skill Development',
    description: 'Curated courses and projects for your growth',
  },
  {
    icon: TrendingUp,
    title: 'Career Tracking',
    description: 'Monitor your progress towards dream roles',
  },
];

export default function WelcomeStep({ onNext }) {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Welcome, {user?.firstName || 'Future Professional'}! 👋
        </h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto">
          Let's set up your personalized career intelligence profile. 
          This will take about 5 minutes.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 mx-auto">
              <feature.icon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white font-medium mb-1">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all"
        >
          Let's Get Started <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
