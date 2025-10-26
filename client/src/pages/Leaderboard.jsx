import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Leaderboard() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api.get('/api/leaderboard').then(({ data }) => setBoard(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Leaderboard</h1>
      <div className="card">
        <div className="grid grid-cols-4 p-3 border-b text-sm text-gray-500">
          <div>Rank</div><div>Name</div><div>Best %</div><div>Attempts</div>
        </div>
        {board.map((row, idx) => (
          <div key={row.userId} className="grid grid-cols-4 p-3 border-b last:border-b-0">
            <div className="font-medium">#{idx + 1}</div>
            <div>{row.name}</div>
            <div>{row.bestPercentage}%</div>
            <div>{row.attempts}</div>
          </div>
        ))}
        {!board.length && <div className="p-4 text-gray-500">No leaderboard data yet.</div>}
      </div>
    </div>
  );
}