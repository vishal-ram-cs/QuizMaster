import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Trophy,
  LogOut,
  PlusSquare,
  BarChart3,
  ListChecks
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        active ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 border-r bg-white p-4 flex flex-col">
      <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
        QuizMaster
      </div>

      <div className="text-xs uppercase text-gray-500 mb-2">Student Portal</div>
      <nav className="space-y-1 mb-4">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/quizzes" icon={BookOpen} label="Available Quizzes" />
        <NavItem to="/results" icon={ListChecks} label="My Results" />
        <NavItem to="/leaderboard" icon={Trophy} label="Leaderboard" />
      </nav>

      {user?.role === 'teacher' && (
        <>
          <div className="text-xs uppercase text-gray-500 mt-4 mb-2">Teacher Tools</div>
          <nav className="space-y-1 mb-4">
            <NavItem to="/create-quiz" icon={PlusSquare} label="Create Quiz" />
            <NavItem to="/my-quizzes" icon={BarChart3} label="My Quizzes" />
            <NavItem to="/analytics" icon={LineChart} label="Analytics" />
          </nav>
        </>
      )}

      <div className="mt-auto">
        {user && (
          <div className="card p-4">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="mt-2">
              <span className="tag">{user.role === 'teacher' ? 'Teacher' : 'Student'}</span>
            </div>
            <button className="btn btn-outline w-full mt-3" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}