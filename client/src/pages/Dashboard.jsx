import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import WelcomeBanner from '../components/WelcomeBanner';
import StatCards from '../components/StatCards';
import QuizCard from '../components/QuizCard';
import QuickActions from '../components/QuickActions';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    api.get('/api/quizzes?limit=6').then(({ data }) => setQuizzes(data));
    api.get('/api/attempt/me').then(({ data }) => setAttempts(data));
  }, []);

  const stats = useMemo(() => {
    const completed = attempts.length;
    const avg = completed ? Math.round(attempts.reduce((a, b) => a + b.percentage, 0) / completed) : 0;
    // Simple streak heuristic: attempts on consecutive days
    const days = [...new Set(attempts.map(a => new Date(a.createdAt).toDateString()))].sort();
    let streak = 0;
    if (days.length) {
      streak = 1;
      for (let i = days.length - 1; i > 0; i--) {
        const d1 = new Date(days[i]);
        const d0 = new Date(days[i - 1]);
        const diff = (d1 - d0) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
      }
    }
    return { available: quizzes.length, completed, avg, streak };
  }, [quizzes, attempts]);

  return (
    <div className="p-6">
      <WelcomeBanner />
      <StatCards stats={stats} />
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Featured Quizzes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <QuizCard key={q._id} quiz={q} />
          ))}
        </div>
      </div>
      <QuickActions />
    </div>
  );
}