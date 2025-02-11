import { getServerSession } from 'next-auth';
import authOptions from '@/utils/authOptions';

const getUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return user;
};

export const getUserID = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }
  const userIDCode = String(user?.id);
  const userID = user?.image ? `google_${userIDCode}` : `mongo_${userIDCode}`;
  return userID;
};

export default getUser;
