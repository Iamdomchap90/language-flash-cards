import { MongoClient } from 'mongodb';
import mongoURI from '@/utils/config';

const options = {};

if (!mongoURI) throw new error('Please add your Mongo URI to .env.local');

let client = new MongoClient(mongoURI, options);
let clientPromise;

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
