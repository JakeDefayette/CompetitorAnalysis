import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IKeyPerson extends Document {
  name: string;
  title?: string;
  company: Types.ObjectId; // Reference to Competitor
  linkedInUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const keyPersonSchema = new Schema<IKeyPerson>({
  name: {
    type: String,
    required: [true, 'Key person name is required.'],
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Competitor', // Establishes the relationship
    required: [true, 'Company reference is required.'],
    index: true, // Index for faster lookups by company
  },
  linkedInUrl: {
    type: String,
    trim: true,
    match: [/^(https|http):\/\/([\w]+\.)?linkedin\.com\//, 'Please enter a valid LinkedIn URL.'],
  },
}, { timestamps: true });

// Ensure virtual fields are serialized
keyPersonSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; } // Remove _id
});

const KeyPerson = mongoose.models.KeyPerson || mongoose.model<IKeyPerson>('KeyPerson', keyPersonSchema);

export default KeyPerson;
