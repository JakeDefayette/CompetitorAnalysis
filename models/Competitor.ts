import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetitor extends Document {
  name: string;
  website?: string;
  linkedInUrl?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'acquired' | 'defunct';
  createdAt: Date;
  updatedAt: Date;
}

const competitorSchema = new Schema<ICompetitor>({
  name: {
    type: String,
    required: [true, 'Competitor name is required.'],
    trim: true,
    unique: true, // Assuming competitor names should be unique
  },
  website: {
    type: String,
    trim: true,
    // Basic URL validation example (more robust validation can be added)
    match: [/^(https|http)?:\/\//, 'Please enter a valid website URL.'],
  },
  linkedInUrl: {
    type: String,
    trim: true,
    // Corrected regex: Removed unnecessary escapes for / and escaped the literal dot
    match: [/^(https|http):\/\/([\w]+\.)?linkedin\.com\//, 'Please enter a valid LinkedIn URL.'],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'acquired', 'defunct'],
    default: 'active',
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt

// Ensure virtual fields are serialized
competitorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; } // Remove _id
});

// Avoid recompiling the model if it already exists
const Competitor = mongoose.models.Competitor || mongoose.model<ICompetitor>('Competitor', competitorSchema);

export default Competitor;
