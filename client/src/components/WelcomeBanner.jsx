import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function WelcomeBanner() {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 bg-gradient-to-r from-primary to-secondary text-white shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
          <p className="text-white/90 mt-1">
            Ready to {user?.role === 'teacher' ? 'create amazing quizzes and inspire learners?' : 'learn and ace your quizzes?'}
          </p>
        </div>
        {user?.role === 'teacher' && (
          <Link to="/create-quiz" className="btn bg-white text-primary hover:bg-white/90">
            <Plus size={18} /> Create New Quiz
          </Link>
        )}
      </div>
    </motion.div>
  );
}