import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Dashboard from './pages/Dashboard';
import AvailableQuizzes from './pages/AvailableQuizzes';
import MyResults from './pages/MyResults';
import Leaderboard from './pages/Leaderboard';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import Analytics from './pages/Analytics';
import TakeQuiz from './pages/TakeQuiz';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Shell = ({ children }) => (
  <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1">{children}</main>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Shell>
                  <Dashboard />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Shell>
                  <AvailableQuizzes />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Shell>
                  <MyResults />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Shell>
                  <Leaderboard />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute role="teacher">
                <Shell>
                  <CreateQuiz />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-quizzes"
            element={
              <ProtectedRoute role="teacher">
                <Shell>
                  <MyQuizzes />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="teacher">
                <Shell>
                  <Analytics />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <Shell>
                  <TakeQuiz />
                </Shell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}