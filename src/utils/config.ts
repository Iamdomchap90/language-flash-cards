import dotenv from 'dotenv';

dotenv.config();

export default const mongoURI = process.env.MONGODB_URI as string;
