import mongoose from 'mongoose';
import VocabCard from '@/models/VocabCard';
import mongoURI from '@/utils/config';
import connect from '@/utils/db';


const documentsToInsert:VocabCardDocument[] = [
  {
    language: 'Russian',
    englishText: 'to travel',
    translationText: 'путешествовать',
    wordType: 'verb',
    verbType: 'imperfect',
    tags: ['travel'],
  },
];

if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in process.env.MONGODB_URI');
}

await connect();

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
