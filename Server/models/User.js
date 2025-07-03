import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    companyOverview: { type: String },
    companyWebsite: {type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['employer', 'jobseeker'],
      required: true,
    },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    skills: { type: [String], default: [] },

  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
