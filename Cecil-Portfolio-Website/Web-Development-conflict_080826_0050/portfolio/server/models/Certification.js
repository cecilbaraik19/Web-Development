import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    issueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Earned', 'In Progress', 'Planned'],
      default: 'Planned',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Certification', certificationSchema);
