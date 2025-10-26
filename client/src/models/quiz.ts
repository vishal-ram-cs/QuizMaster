export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    id: string;
    quizId: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
}