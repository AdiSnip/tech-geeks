import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMentor extends Document {
  user: Types.ObjectId; // References the User model (where email/name live)
  expertise: string[];
  bio: string;
  rating: number;
  available: boolean;
  sessionsCompleted: number;
}

const MentorSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expertise: [{ type: String, required: true }],
  bio: { type: String, required: true, maxlength: 500 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  available: { type: Boolean, default: true },
  sessionsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export const Mentor = mongoose.models.mentors || mongoose.model<IMentor>('mentors', MentorSchema);