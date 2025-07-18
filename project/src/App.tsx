import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import JobPost  from './pages/JobPost';
import ApplyJob from './pages/ApplyJob';
import EditJob from "./pages/EditJob";
import CompanyProfile from './pages/CompanyProfile';
import UserProfile from './pages/UserProfile';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employer/post-job" element={<JobPost/>}/>
            <Route path="/jobs/:id/apply" element={<ApplyJob />} />
            <Route path="/employer/edit-job/:jobId" element={<EditJob />} />
            <Route path="/employer/company-profile" element={<CompanyProfile/>} />
            <Route path="/user-profile" element={<UserProfile/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;