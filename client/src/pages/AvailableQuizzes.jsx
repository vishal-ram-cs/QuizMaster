import { useEffect, useState } from 'react';
import api from '../api/axios';
import QuizCard from '../components/QuizCard';

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    api.get('/api/quizzes').then(({ data }) => setQuizzes(data));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Available Quizzes</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {quizzes.map((q) => <QuizCard key={q._id} quiz={q} />)}
      </div>
    </div>
  );
}