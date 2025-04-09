import mongoose from 'mongoose';
import { IVocabCard } from '@/types/models';

const { Schema } = mongoose;

const vocabSchema = new Schema<IVocabCard>(
  {
    englishText: { type: String },
    translationText: { type: String, unique: true },
    wordType: { type: String, unique: false },
    verbType: { type: String, default: null },
    tags: { type: Array, of: String, unique: false },
    language: { type: String, unique: false },
  },
  { timestamps: true }
);

vocabSchema.index({ englishText: 1, language: 1 }, { unique: true });

const VocabCard =
  mongoose.models.VocabCard || mongoose.model<IVocabCard>('VocabCard', vocabSchema);

export default VocabCard;
