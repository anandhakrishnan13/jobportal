export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
  createdAt: string;
  companyOverview?: string;
}

export interface Application {
  _id: string;
  jobId: string | Job;        // <-- ✅ Can be string (ObjectId) or populated Job
  userId: string | User; 
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: {
  data: Buffer;
  contentType: string;
  originalName: string;
};
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  company?: string;
  createdAt: string;
  companyOverview?: string;
}

export interface StatCardProps {
  label: string;
  value: number;
  color: string;
  isDarkMode: boolean;
}