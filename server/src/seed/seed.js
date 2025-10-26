import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import { connectDB } from "../config/db.js";

dotenv.config();

(async () => {
try {
await connectDB();
await User.deleteMany({});
await Quiz.deleteMany({});

const teacher = await User.create({
  name: "Vishal Ramanathan",
  email: "vishal@example.com",
  password: await bcrypt.hash("password123", 10),
  role: "teacher"
});

await User.create({
  name: "Learner One",
  email: "student@example.com",
  password: await bcrypt.hash("password123", 10),
  role: "student"
});

await Quiz.create([
  {
    title: "JavaScript Fundamentals",
    description: "Core JS concepts: variables, functions, arrays, objects.",
    category: "Programming",
    difficulty: "Easy",
    duration: 20,
    passPercent: 70,
    creator: teacher._id,
    questions: [
      { text: "Which keyword declares a block-scoped variable?", options: ["var","let","const","static"], correctIndex: 1, marks: 1 },
      { text: "What is the output of typeof null?", options: ["null","object","undefined","boolean"], correctIndex: 1, marks: 1 },
      { text: "Which array method adds an element to the end?", options: ["push","pop","shift","unshift"], correctIndex: 0, marks: 1 }
    ]
  },
  {
    title: "World History Basics",
    description: "Important events and timelines in world history.",
    category: "History",
    difficulty: "Medium",
    duration: 25,
    passPercent: 60,
    creator: teacher._id,
    questions: [
      { text: "In which year did World War II end?", options: ["1945","1939","1918","1963"], correctIndex: 0, marks: 1 },
      { text: "Who was the first Emperor of Rome?", options: ["Julius Caesar","Augustus","Nero","Caligula"], correctIndex: 1, marks: 1 }
    ]
  }
]);

console.log("Seed complete. Users and sample quizzes added.");
process.exit(0);
} catch (e) {
console.error(e);
process.exit(1);
}
})();
