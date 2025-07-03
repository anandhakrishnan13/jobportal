import express from 'express';
import { postJob, getAllJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', postJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById)
router.put("/:id", updateJob);            // PUT /api/jobs/:id ✅ NEW
router.delete("/:id", deleteJob);         // DELETE /api/jobs/:id ✅ NEW

export default router;
