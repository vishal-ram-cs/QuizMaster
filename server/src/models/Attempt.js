import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{ type: Number, required: true }], // chosen option index per question
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeTaken: { type: Number, default: 0 } // seconds
  },
  { timestamps: true }
);

attemptSchema.index({ quiz: 1, user: 1 });

export default mongoose.model('Attempt', attemptSchema);