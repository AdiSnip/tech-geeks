import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const GEN_SALT_ROUNDS = 10;

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'user';
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture?: string;
  orderHistory?: [{
    orderId: Types.ObjectId
  }];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    default: 'user',
    required: true
  },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  profilePicture: String,
  orderHistory: [{
    orderId: {
      type: Schema.ObjectId,
      ref: 'Order'
    }
  }]
}, { timestamps: true });

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(GEN_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
