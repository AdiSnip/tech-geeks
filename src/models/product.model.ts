import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  owner: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: 'active' | 'draft' | 'soldout';
  totalRevenue: number;
  productSold: number;
  soldOrderInfo: {
    date: Date;
    quantity: number;
    revenue: number;
    orderId: Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'draft', 'soldout'],
      default: 'draft',
    },
    totalRevenue: { type: Number, default: 0, min: 0 },
    productSold: { type: Number, default: 0, min: 0 },
    soldOrderInfo: {
      type: [
        {
          date: { type: Date, default: Date.now },
          quantity: { type: Number, default: 0 },
          revenue: { type: Number, default: 0 },
          orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        }
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
