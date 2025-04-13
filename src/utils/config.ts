import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI as string;

export default mongoURI;
