import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const GEN_SALT_ROUNDS = 10;

export interface IEntrepreneur extends Document {
  email: string;
  password?: string;
  role: 'entrepreneur' | 'admin';
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture?: string;
  businessType?: string;
  companyName?: string;
  companyDescription?: string;
  website?: string;
  industry?: string;
  profileComplete: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const EntrepreneurSchema: Schema<IEntrepreneur> = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['entrepreneur', 'mentor', 'admin'],
    default: 'entrepreneur',
    required: true
  },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true, index: true }, // Added index
    state: { type: String, required: true, index: true }, // Added index
    zipCode: { type: String, required: true },
    country: { type: String, required: true, index: true }, // Added index
  },
  profilePicture: String,
  businessType: { type: String, index: true },
  companyName: { type: String, index: true },
  companyDescription: String,
  website: String,
  industry: { type: String, index: true },
  profileComplete: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

EntrepreneurSchema.pre<IEntrepreneur>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(GEN_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

EntrepreneurSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const Entrepreneur = mongoose.models.Entrepreneur || mongoose.model<IEntrepreneur>('Entrepreneur', EntrepreneurSchema);
