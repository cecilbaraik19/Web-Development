import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    period: { type: String, default: '' }, // e.g. "2024", "Now", "Next"
    status: {
      type: String,
      enum: ['done', 'current', 'next'],
      default: 'next',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Journey', journeySchema);
