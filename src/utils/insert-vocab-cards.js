import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VocabCard from '../models/VocabCard.js';

dotenv.config();

const documentsToInsert = [
  {
    language: 'Korean',
    englishText: 'apple',
    translationText: '사과',
    wordType: 'noun',
    tags: ['fruit'],
  },
  {
    language: 'Korean',
    englishText: 'book',
    translationText: '책',
    wordType: 'noun',
    tags: ['education'],
  },
  {
    language: 'Korean',
    englishText: 'man',
    translationText: '남자',
    wordType: 'noun',
    tags: ['People', 'Family'],
  },
  {
    language: 'Korean',
    englishText: 'woman',
    translationText: '여자',
    wordType: 'noun',
    tags: ['People', 'Family'],
  },
  {
    language: 'Korean',
    englishText: 'child',
    translationText: '아이',
    wordType: 'noun',
    tags: ['People', 'Family'],
  },
  {
    language: 'Korean',
    englishText: 'to know',
    translationText: '알다',
    wordType: 'verb',
    tags: ['People', 'General'],
  },
  {
    language: 'Korean',
    englishText: 'to see',
    translationText: '보다',
    wordType: 'verb',
    tags: ['General'],
  },
  {
    language: 'Korean',
    englishText: 'to eat',
    translationText: '먹다',
    wordType: 'verb',
    tags: ['Food'],
  },
  {
    language: 'Korean',
    englishText: 'I',
    translationText: '나',
    wordType: 'pronoun',
    tags: ['General', 'About Myself'],
  },
  {
    language: 'Korean',
    englishText: 'you',
    translationText: '너',
    wordType: 'pronoun',
    tags: ['Getting Acquainted'],
  },
  {
    language: 'Korean',
    englishText: 'he',
    translationText: '그',
    wordType: 'pronoun',
    tags: ['General'],
  },
  {
    language: 'Korean',
    englishText: 'good',
    translationText: '좋다',
    wordType: 'adjective',
    tags: ['General'],
  },
  {
    language: 'Korean',
    englishText: 'bad',
    translationText: '나쁘다',
    wordType: 'adjective',
    tags: ['General'],
  },
  {
    language: 'Korean',
    englishText: 'big',
    translationText: '큰',
    wordType: 'adjective',
    tags: ['General'],
  },
  {
    language: 'Korean',
    englishText: 'time',
    translationText: '시간',
    wordType: 'noun',
    tags: ['General', 'Calendar'],
  },
  {
    language: 'Korean',
    englishText: 'day',
    translationText: '하루',
    wordType: 'noun',
    tags: ['General', 'Calendar'],
  },
  {
    language: 'Korean',
    englishText: 'year',
    translationText: '년',
    wordType: 'noun',
    tags: ['General', 'Calendar'],
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

VocabCard.insertMany(documentsToInsert)
  .then((insertedDocs) => {
    console.log(`${insertedDocs.length} documents inserted`);
  })
  .catch((error) => {
    console.error('Error inserting documents:', error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
