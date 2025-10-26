import { Link } from 'react-router-dom';
import { Compass, BarChart2, Trophy } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { to: '/quizzes', icon: Compass, label: 'Browse All Quizzes' },
    { to: '/results', icon: BarChart2, label: 'View My Progress' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' }
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      {actions.map((a) => (
        <Link key={a.label} to={a.to} className="card p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 text-primary rounded-lg">
              <a.icon size={18} />
            </div>
            <div className="font-medium">{a.label}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}