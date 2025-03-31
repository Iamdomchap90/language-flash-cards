import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VocabCard from '../models/VocabCard.js';

dotenv.config();

const documentsToInsert = [
  {
    language: 'Russian',
    englishText: 'to travel',
    translationText: 'путешествовать',
    wordType: 'verb',
    verbType: 'imperfect',
    tags: ['travel'],
  },
];

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in process.env.MONGODB_URI');
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

VocabCard.deleteMany({});
// VocabCard.bulkWrite(bulkOps)
VocabCard.insertMany(documentsToInsert, { ordered: false })
  .then((insertedDocs) => {
    console.log(`${insertedDocs.length} documents inserted`);
  })
  .catch((error) => {
    if (error.code === 11000) {
      console.warn(
        'Duplicate key error encountered, some documents were skipped.'
      );
    } else {
      console.error('Error inserting documents:', error);
    }
  })
  .finally(() => {
    mongoose.disconnect();
  });
