import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String }, // Optional, only required if role is "employer"
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'jobseeker'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
