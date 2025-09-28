import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const GEN_SALT_ROUNDS = 10;

// 1. TypeScript Interface for the Document
export interface IUser extends Document {
  email: string;
  password?: string; // Stored hashed
  role: 'entrepreneur' | 'mentor' | 'admin';
  name: string;
  location: string;
  businessType: string;
  profileComplete: number; // 0 to 100%
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Password field is hidden by default
  role: { 
    type: String, 
    enum: ['entrepreneur', 'mentor', 'admin'], 
    default: 'entrepreneur',
    required: true 
  },
  name: { type: String, required: true },
  location: { type: String, required: true },
  businessType: { type: String, required: true },
  profileComplete: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

UserSchema.pre<IUser>('save', async function (next) {
  if(!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(GEN_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// 3. Mongoose Model
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);