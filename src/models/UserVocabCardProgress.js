import mongoose from 'mongoose';

const { Schema } = mongoose;

const userVocabCardProgressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vocabCard: {
      type: Schema.Types.ObjectId,
      ref: 'VocabCard',
      required: true,
    },
    totalAttempts: { type: Number, default: 0 },
    incorrectAnswerCount: { type: Number, default: 0 },
    lastAttemptedAt: { type: Date, default: null },
    nextReviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const UserVocabCardProgress =
  mongoose.models.UserVocabCardProgress ||
  mongoose.model('UserVocabCardProgress', userVocabCardProgressSchema);

export default UserVocabCardProgress;
