import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  BookOpen, 
  TrendingUp,
  Brain,
  Stethoscope,
  Leaf,
  Building2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Our ML models analyze your skills and recommend personalized career pathways',
  },
  {
    icon: Target,
    title: 'Skill Gap Detection',
    description: 'Identify exactly which skills you need to develop for your dream career',
  },
  {
    icon: BookOpen,
    title: 'Smart Recommendations',
    description: 'Get curated courses and projects matched to your learning style',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your growth with intuitive dashboards and analytics',
  },
];

const sectors = [
  {
    icon: Stethoscope,
    name: 'Healthcare',
    description: 'Medical AI, Health Informatics, Telemedicine',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Leaf,
    name: 'Agriculture',
    description: 'Precision Farming, AgriTech, Sustainable Systems',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Building2,
    name: 'Urban & Smart City',
    description: 'IoT, Smart Infrastructure, Urban Planning',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
  },
];

const benefits = [
  'Personalized learning paths based on your profile',
  'Integration with top online learning platforms',
  'Real-time skill gap analysis',
  'Industry-aligned career recommendations',
  'Progress tracking and analytics',
  'YouTube video recommendations for each skill',
];

export default function LandingPage() {
  return (
    <AnimatedBackground>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Career Saarthi</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">AI-Powered Career Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Shape Your Future in
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Emerging Tech Sectors
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Discover your ideal career path in Healthcare, Agriculture, or Urban Technology. 
              Our AI analyzes your skills and provides personalized recommendations to accelerate your growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-gray-700"
              >
                I Already Have an Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Sector
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Focus on emerging sectors with high growth potential and meaningful impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full transition-all group-hover:border-gray-600 group-hover:bg-gray-800/70">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sector.gradient} flex items-center justify-center mb-4`}>
                    <sector.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{sector.name}</h3>
                  <p className="text-gray-400">{sector.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Intelligence
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform uses machine learning to provide personalized career guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Everything You Need to
                <br />
                <span className="text-blue-400">Accelerate Your Career</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Our comprehensive platform combines AI-powered analysis, personalized recommendations, 
                and progress tracking to help you reach your career goals faster.
              </p>
              <Link 
                to="/signup"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Get Started Free <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are using AI to navigate their career paths 
              in Healthcare, Agriculture, and Urban Technology.
            </p>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold text-white">Career Saarthi</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Career Saarthi. Career Intelligence for Emerging Sectors.
          </p>
        </div>
      </footer>
    </AnimatedBackground>
  );
}
