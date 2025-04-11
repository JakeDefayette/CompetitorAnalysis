import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for pricing structure (example)
interface IPricing {
  model: 'subscription' | 'one-time' | 'freemium' | 'usage-based';
  amount?: number;
  currency?: string;
  interval?: 'monthly' | 'yearly' | 'per_unit';
}

// Interface for product specifications (example)
interface ISpecs {
  [key: string]: any; // Flexible structure for various specs
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  specs?: ISpecs;
  pricing?: IPricing;
  competitor: Types.ObjectId; // Reference to Competitor
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  specs: {
    type: Schema.Types.Mixed, // Allows flexible object structure
    default: {},
  },
  pricing: {
    model: {
      type: String,
      enum: ['subscription', 'one-time', 'freemium', 'usage-based'],
    },
    amount: Number,
    currency: String,
    interval: {
      type: String,
      enum: ['monthly', 'yearly', 'per_unit'],
    },
  },
  competitor: {
    type: Schema.Types.ObjectId,
    ref: 'Competitor',
    required: [true, 'Competitor reference is required.'],
    index: true, // Index for faster lookups by competitor
  },
}, { timestamps: true });

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; } // Remove _id
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
