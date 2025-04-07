import mongoose from 'mongoose';

const { Schema } = mongoose;

export const generateThirtyDayActivity = () => {
  const activity = new Map();
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    activity.set(formattedDate, 0);
  }

  return activity;
};

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: false }, // false for oauth users
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    Russian: {
      attemptedCardCount: { type: Number, default: 0 },
      errorCount: { type: Number, default: 0 },
      activeStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      thirtyDayActivity: {
        type: Map,
        of: Number,
        default: () => generateThirtyDayActivity(),
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
