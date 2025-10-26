import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr('');
      await login(form.email, form.password);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
      <form onSubmit={submit} className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to QuizMaster</h1>
        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
        <button className="btn btn-primary w-full">Login</button>
        <div className="text-sm text-gray-600 mt-3">
          No account? <Link to="/signup" className="text-primary">Sign up</Link>
        </div>
      </form>
    </div>
  );
}