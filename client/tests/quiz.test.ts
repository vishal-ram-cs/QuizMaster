import { Quiz } from '../src/models/quiz';
import { Question } from '../src/models/question';

describe('Quiz Model', () => {
    it('should create a quiz with a title and questions', () => {
        const questions: Question[] = [
            new Question('What is the capital of France?', ['Paris', 'London', 'Berlin'], 'Paris'),
            new Question('What is 2 + 2?', ['3', '4', '5'], '4')
        ];
        const quiz = new Quiz('Geography Quiz', questions);
        
        expect(quiz.title).toBe('Geography Quiz');
        expect(quiz.questions.length).toBe(2);
    });
});