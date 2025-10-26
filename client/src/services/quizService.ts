// quizService.ts

import { Quiz } from '../models/quiz';
import { Question } from '../models/question';

export class QuizService {
    private quizzes: Quiz[] = [];

    public createQuiz(quiz: Quiz): void {
        this.quizzes.push(quiz);
    }

    public getQuizzes(): Quiz[] {
        return this.quizzes;
    }

    public getQuizById(id: string): Quiz | undefined {
        return this.quizzes.find(quiz => quiz.id === id);
    }

    public addQuestionToQuiz(quizId: string, question: Question): void {
        const quiz = this.getQuizById(quizId);
        if (quiz) {
            quiz.questions.push(question);
        }
    }
}