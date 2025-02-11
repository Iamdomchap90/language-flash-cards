import mongoose from 'mongoose';

const { Schema } = mongoose;

const vocabSchema = new Schema(
  {
    englishText: { type: String },
    translationText: { type: String, unique: true },
    wordType: { type: String, unique: false },
    tags: { type: Array, of: String, unique: false },
    language: { type: String, unique: false },
  },
  { timestamps: true }
);

vocabSchema.index({ englishText: 1, language: 1 }, { unique: true });

const VocabCard =
  mongoose.models.VocabCard || mongoose.model('VocabCard', vocabSchema);

export default VocabCard;
