import { Brain, CheckCircle, Percent, Flame } from 'lucide-react';

export default function StatCards({ stats }) {
  const items = [
    { label: 'Available Quizzes', value: stats.available || 0, icon: Brain },
    { label: 'Completed', value: stats.completed || 0, icon: CheckCircle },
    { label: 'Average Score', value: `${stats.avg || 0}%`, icon: Percent },
    { label: 'Study Streak', value: `${stats.streak || 0} days`, icon: Flame }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      {items.map((item) => (
        <div key={item.label} className="card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-50 text-primary">
            <item.icon size={20} />
          </div>
          <div>
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}