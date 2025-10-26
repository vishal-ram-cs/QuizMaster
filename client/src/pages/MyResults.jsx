import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyResults() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    api.get('/api/attempt/me').then(({ data }) => setAttempts(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Results</h1>
      <div className="space-y-3">
        {attempts.map((a) => (
          <div key={a._id} className="card p-4">
            <div className="font-medium">{a.quiz.title}</div>
            <div className="text-sm text-gray-500">
              {a.quiz.category} • {a.quiz.difficulty}
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <div>Score: {a.score}/{a.total}</div>
              <div>Percentage: {a.percentage}%</div>
              <div className={a.passed ? 'text-green-600' : 'text-red-600'}>
                {a.passed ? 'Passed' : 'Failed'}
              </div>
            </div>
          </div>
        ))}
        {!attempts.length && <div className="text-gray-500">No attempts yet.</div>}
      </div>
    </div>
  );
}