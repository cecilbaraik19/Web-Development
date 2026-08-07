import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    image: { type: String, default: '' }, // image URL — a generated cover is used when empty
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'MERN', 'Cybersecurity', 'Cloud', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planned'],
      default: 'Planned',
    },
    completedAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
