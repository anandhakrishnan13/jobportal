import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Internship', 'Remote'],
    default: 'Full Time'
  },
  description: { type: String },
  salary: { type: Number },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
