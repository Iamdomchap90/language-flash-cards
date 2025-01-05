import mongoose from 'mongoose';

const { Schema } = mongoose;

const vocabSchema = new Schema(
  {
    englishText: { type: String, unique: true },
    translationText: { type: String, unique: true },
    wordType: { type: String, unique: false },
    tags: { type: Array, of: String, unique: false },
  },
  { timestamps: true }
);

const VocabCard =
  mongoose.models.VocabCard || mongoose.model('VocabCard', vocabSchema);

export default VocabCard;
