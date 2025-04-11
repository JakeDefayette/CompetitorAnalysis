import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUpdate extends Document {
  type: 'news' | 'funding' | 'product_launch' | 'partnership' | 'hiring' | 'other';
  source?: string; // URL or description of the source
  content: string;
  timestamp?: Date;
  importance?: 'high' | 'medium' | 'low';
  competitor: Types.ObjectId; // Reference to Competitor
  createdAt: Date;
  updatedAt: Date;
}

const updateSchema = new Schema<IUpdate>({
  type: {
    type: String,
    required: [true, 'Update type is required.'],
    enum: ['news', 'funding', 'product_launch', 'partnership', 'hiring', 'other'],
    index: true,
  },
  source: {
    type: String,
    trim: true,
    // Basic URL validation example (can be expanded)
    match: [/^(http|https)?:\/\//, 'Please enter a valid source URL if applicable.'],
  },
  content: {
    type: String,
    required: [true, 'Update content is required.'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  importance: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true,
  },
  competitor: {
    type: Schema.Types.ObjectId,
    ref: 'Competitor',
    required: [true, 'Competitor reference is required.'],
    index: true,
  },
}, { timestamps: true });

// Ensure virtual fields are serialized
updateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; } // Remove _id
});

const Update = mongoose.models.Update || mongoose.model<IUpdate>('Update', updateSchema);

export default Update;
