import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Analytics() {
  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    // Simple analytics for teacher: all attempts across their quizzes
    (async () => {
      const mine = await api.get('/api/quizzes/mine');
      const ids = mine.data.map(q => q._id);
      const all = (await Promise.all(ids.map(async id => {
        const { data } = await api.get(`/api/leaderboard?quizId=${id}&limit=1000`);
        return data.map(d => ({ quizId: id, ...d }));
      }))).flat();
      setAttempts(all);
    })();
  }, []);
  const avg = attempts.length ? Math.round(attempts.reduce((a,b)=>a + b.bestPercentage, 0)/attempts.length) : 0;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Analytics</h1>
      <p className="text-gray-600 mb-4">Average best score across your quizzes: {avg}%</p>
      <div className="card p-4 text-sm">
        <div className="text-gray-500">Total unique learners (best-score entries): {attempts.length}</div>
      </div>
    </div>
  );
}