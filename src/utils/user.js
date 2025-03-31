import { getServerSession } from 'next-auth';
import authOptions from '@/utils/authOptions';
import mongoose from 'mongoose';
import connect from '@/utils/db';
import User from '@/models/User';


export const getUserID = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  return new mongoose.Types.ObjectId(session.user?.id);
};

const getUser = async () => {
  try {
    const id = await getUserID();
    if (!id) {
      console.error("Error: User ID is undefined or null.");
      return null;
    }

    await connect();

    const user = await User.findOne({ _id: id });
    if (!user) {
      console.warn(`Warning: No user found with ID ${id}`);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getUser;
