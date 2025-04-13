import mongoose, { ConnectOptions } from 'mongoose';
import mongoURI from '@/utils/config';

const connect = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;
    const options: ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(uri, options);
  } catch (error) {
    throw new Error('Connection to database failed!');
  }
};

export default connect;
