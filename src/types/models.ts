import { HydratedDocument, Types } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password?: string | null;
  Russian: {
    attemptedCardCount: number;
    errorCount: number;
    activeStreak: number;
    longestStreak: number;
    thirtyDayActivity: Map<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

export interface IUserVocabCardProgress {
  user: Types.ObjectId;
  vocabCard: Types.ObjectId;
  totalAttempts: number;
  incorrectAnswerCount: number;
  lastAttemptedAt: Date;
  nextReviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserVocabCardProgressDocument =
  HydratedDocument<IUserVocabCardProgress>;

export interface IVocabCard {
  englishText: string;
  translationText: string;
  wordType: string;
  verbType: string;
  tags: string[];
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VocabCardDocument = HydratedDocument<IVocabCard>;
