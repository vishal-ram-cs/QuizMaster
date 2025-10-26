import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  const load = async () => {
    const { data } = await api.get('/api/quizzes/mine');
    setQuizzes(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    await api.delete(`/api/quizzes/${id}`);
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Quizzes</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map(q => (
          <div key={q._id} className="card p-4">
            <div className="font-semibold">{q.title}</div>
            <div className="text-sm text-gray-500">{q.category} • {q.difficulty}</div>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-outline" onClick={() => alert('Edit UI omitted for brevity')}>Edit</button>
              <button className="btn btn-primary" onClick={() => remove(q._id)}>Delete</button>
            </div>
          </div>
        ))}
        {!quizzes.length && <div className="text-gray-500">No quizzes yet.</div>}
      </div>
    </div>
  );
}