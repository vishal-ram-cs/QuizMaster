// client/src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    // Client-side checks to give instant feedback
    if (!form.name.trim()) return setErr('Name is required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Enter a valid email');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters');

    try {
      setErr('');
      await signup(form);
      nav('/');
    } catch (e) {
      const resp = e.response?.data;
      const messages = Array.isArray(resp?.errors)
        ? resp.errors.map(er => er.msg).join(', ')
        : resp?.message || 'Signup failed';
      setErr(messages);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
      <form onSubmit={submit} className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create your account</h1>
        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Full name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />
        <select
          className="w-full border rounded-lg p-2 mb-3"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}

        <button className="btn btn-primary w-full">Sign up</button>
        <div className="text-sm text-gray-600 mt-3">
          Have an account? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </form>
    </div>
  );
}