import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Internship', 'Remote'],
    default: 'Full Time',
    required: true
  },
  category: { type: String, required: true }, 
  description: { type: String, required: true },
  requirements: { type: [String], required: true },             
  salary: { type: String, required: true },    
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
