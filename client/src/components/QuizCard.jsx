import { Tag, Timer, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="tag">{quiz.category}</span>
        <span className="tag">{quiz.difficulty}</span>
      </div>
      <h3 className="font-semibold text-lg">{quiz.title}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{quiz.description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
        <div className="flex items-center gap-1">
          <Timer size={16} /> {quiz.duration} min
        </div>
        <div className="flex items-center gap-1">
          <Gauge size={16} /> Pass: {quiz.passPercent}%
        </div>
      </div>
      <Link to={`/quiz/${quiz._id}`} className="btn btn-primary mt-4 w-fit">
        Start
      </Link>
    </div>
  );
}