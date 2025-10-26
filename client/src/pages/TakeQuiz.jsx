import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TakeQuiz() {
  const { id } = useParams();
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/quizzes/${id}`);
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(null));
    })();
  }, [id]);

  const submit = async () => {
    if (answers.some(a => a === null)) return setMsg('Please answer all questions');
    try {
      const { data } = await api.post('/api/attempt', { quizId: id, answers });
      alert(`Submitted! Score ${data.score}/${data.total} (${data.percentage}%) — ${data.passed ? 'Passed' : 'Failed'}`);
      nav('/results');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Submit failed');
    }
  };

  if (!quiz) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-sm text-gray-500">{quiz.category} • {quiz.difficulty} • {quiz.duration} min</div>
          </div>
          <div className="text-sm">Pass: {quiz.passPercent}%</div>
        </div>
      </div>
      <div className="space-y-4 mt-4">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="card p-4">
            <div className="font-medium mb-2">{qi + 1}. {q.text}</div>
            <div className="grid md:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className={`border rounded-lg p-2 cursor-pointer ${answers[qi]===oi?'border-primary bg-violet-50':''}`}>
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    className="mr-2"
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers(a => { const c=[...a]; c[qi]=oi; return c; })}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {msg && <div className="text-red-600 mt-2">{msg}</div>}
      <button className="btn btn-primary mt-4" onClick={submit}>Submit Quiz</button>
    </div>
  );
}