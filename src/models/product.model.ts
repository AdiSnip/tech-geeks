import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  owner: Types.ObjectId; // References the User model
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: 'active' | 'draft' | 'soldout';
  soldDate?: Date;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['active', 'draft', 'soldout'], default: 'draft' },
  soldDate: { type: Date },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);