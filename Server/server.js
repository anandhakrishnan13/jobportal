import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { loginUser } from './controllers/authController.js';

import { registerUser } from './controllers/authController.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from "./routes/applicationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/categories", categoryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => res.send('API is running'));
app.post('/api/login', loginUser);
app.post('/api/register', registerUser);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
