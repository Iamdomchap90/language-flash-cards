import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VocabCard from '../models/VocabCard.js';

dotenv.config();

const documentsToInsert = [
  {
    language: 'Russian',
    englishText: 'to ask',
    translationText: 'спрашивать',
    wordType: 'verb',
    tags: ['general'],
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
VocabCard.insertMany(documentsToInsert)
  // VocabCard.bulkWrite(bulkOps)
  .then((insertedDocs) => {
    console.log(`${insertedDocs.length} documents inserted`);
  })
  .catch((error) => {
    console.error('Error inserting documents:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
