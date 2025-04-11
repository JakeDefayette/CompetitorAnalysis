import mongoose, { Document, Schema } from 'mongoose';

// Example interface for notification preferences
interface INotificationPreferences {
  emailUpdates?: boolean;
  newCompetitorAlerts?: boolean;
  keyPersonChanges?: boolean;
}

export interface IUser extends Document {
  email: string;
  password?: string; // Will be hashed, optional if using OAuth etc.
  role?: 'admin' | 'editor' | 'viewer';
  notificationPreferences?: INotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    index: true,
  },
  password: {
    type: String,
    // Password validation (length, complexity) should be handled before hashing
    // Consider making this optional if using external auth providers
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  },
  notificationPreferences: {
    emailUpdates: { type: Boolean, default: true },
    newCompetitorAlerts: { type: Boolean, default: false },
    keyPersonChanges: { type: Boolean, default: false },
  },
}, { timestamps: true });

// We will add password hashing logic using a pre-save hook later
// Example (needs bcrypt installed):
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password') || !this.password) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; delete ret.password; } // Remove _id and password hash
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
