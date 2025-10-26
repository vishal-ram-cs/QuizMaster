import React from 'react';
import { Question } from '../models/question';

interface QuizProps {
    title: string;
    questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ title, questions }) => {
    return (
        <div>
            <h1>{title}</h1>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>{question.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default Quiz;