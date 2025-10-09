import mongoose, { Document, Schema, Types } from "mongoose";

interface Order extends Document {
    userId: Types.ObjectId;
    items: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'delivered' | 'canceled' | 'returned';
    orderedDate: Date;
    deliveredDate?: Date;
    canceledDate?: Date;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    paymentMethod: string;
}

export const OrderSchema: Schema<Order> = new Schema(
    {
        userId: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: Schema.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'delivered', 'canceled', 'returned'],
            required: true
        },
        orderedDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        deliveredDate: {
            type: Date,
            required: false
        },
        canceledDate: {
            type: Date,
            required: false
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true }
        },
        paymentMethod: {
            type: String,
            required: true
        }

    },
    { timestamps: true }
);

OrderSchema.pre<Order>('save', async function (next) {
    const total = this.items.reduce((acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity, 0);
    this.totalAmount = total;
    next();
});

export default mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);


