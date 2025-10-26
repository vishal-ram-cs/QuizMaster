import { useState } from 'react';
import api from '../api/axios';

export default function CreateQuiz() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', difficulty: 'Easy',
    duration: 20, passPercent: 70, questions: [
      { text: '', options: ['', ''], correctIndex: 0, marks: 1 }
    ]
  });
  const [msg, setMsg] = useState('');

  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, { text: '', options: ['', ''], correctIndex: 0, marks: 1 }]}));
  const removeQuestion = (i) => setForm(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

  const updateQuestion = (i, key, value) => {
    setForm(f => {
      const qs = [...f.questions];
      qs[i] = { ...qs[i], [key]: value };
      return { ...f, questions: qs };
    });
  };
  const updateOption = (qi, oi, value) => {
    setForm(f => {
      const qs = [...f.questions];
      const opts = [...qs[qi].options];
      opts[oi] = value;
      qs[qi].options = opts;
      return { ...f, questions: qs };
    });
  };
  const addOption = (qi) => updateQuestion(qi, 'options', [...form.questions[qi].options, '']);
  const removeOption = (qi, oi) => updateQuestion(qi, 'options', form.questions[qi].options.filter((_, i) => i !== oi));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setMsg('');
      const { data } = await api.post('/api/quizzes', form);
      setMsg(`Created quiz: ${data.title}`);
      setForm({...form, title:'', description:'', category:''});
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Quiz</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="border rounded-lg p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <input className="border rounded-lg p-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
          <select className="border rounded-lg p-2" value={form.difficulty} onChange={e=>setForm({...form, difficulty:e.target.value})}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <input className="border rounded-lg p-2" type="number" placeholder="Duration (min)" value={form.duration} onChange={e=>setForm({...form, duration:Number(e.target.value)})}/>
          <input className="border rounded-lg p-2" type="number" placeholder="Pass %" value={form.passPercent} onChange={e=>setForm({...form, passPercent:Number(e.target.value)})}/>
        </div>
        <textarea className="border rounded-lg p-2 w-full" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <div className="space-y-6">
          {form.questions.map((q, qi) => (
            <div key={qi} className="card p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Question {qi + 1}</div>
                <button type="button" className="text-sm text-red-600" onClick={() => removeQuestion(qi)}>Remove</button>
              </div>
              <input className="border rounded-lg p-2 w-full mb-2" placeholder="Question text" value={q.text} onChange={e=>updateQuestion(qi,'text',e.target.value)} />
              <div className="grid md:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 items-center">
                    <input className="border rounded-lg p-2 w-full" placeholder={`Option ${oi + 1}`} value={opt} onChange={e=>updateOption(qi,oi,e.target.value)} />
                    <input type="radio" name={`correct-${qi}`} checked={q.correctIndex===oi} onChange={()=>updateQuestion(qi,'correctIndex',oi)} />
                    <button type="button" className="text-xs text-gray-500" onClick={()=>removeOption(qi,oi)}>x</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="btn btn-outline" onClick={()=>addOption(qi)}>Add Option</button>
                <input className="border rounded-lg p-2 w-28" type="number" min="1" value={q.marks} onChange={e=>updateQuestion(qi,'marks',Number(e.target.value))} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline" onClick={addQuestion}>Add Question</button>
        <div>
          <button className="btn btn-primary">Create Quiz</button>
          {msg && <span className="ml-3 text-sm text-gray-600">{msg}</span>}
        </div>
      </form>
    </div>
  );
}