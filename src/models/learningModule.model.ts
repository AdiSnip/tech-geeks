import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningModule extends Document {
  title: string;
  category: string;
  description: string;
  content: string; // Could be a rich text/markdown string
  language: string; 
  durationMinutes: number;
}

const LearningModuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, default: 'EN' },
  durationMinutes: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export const LearningModule = mongoose.models.LearningModule || mongoose.model<ILearningModule>('LearningModule', LearningModuleSchema);