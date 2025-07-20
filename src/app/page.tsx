'use client';
import {useEffect, useState} from 'react';

type Job = {
  id: string;
  company: string;
  position: string;
  status: string;
}

export default function Home() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('applied');
  const [message, setMessage] = useState('');  
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const res = await fetch('/api/jobs');
      if (res.ok){
        setJobs(await res.json());
      } else {
        console.error('Failed to load jobs');
      }
    }
    loadJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('api/jobs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({company, position, status}),
    });

    if (res.ok) {
      setMessage('Job added successfully');
      setCompany('');
      setStatus('applied');
      } else {
        setMessage('Failed to add job');
      }
    };

    const updateStatus = async (jobID: string, newStatus: string) => {
      const res = await fetch(`/api/jobs/${jobID}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: newStatus}),
      });

      if (res.ok) {
        const updatedJob = await res.json();
        setJobs((prev) => 
          prev.map((job) => job.id === updatedJob.id ? updatedJob : job)
        );
      } else {
        console.error('Failed to update status');
      }
    }


    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-md mt-6 rounded">
        <h1 className="text-2xl font-bold mb-4">Add a Job</h1>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>

            <option value="rejected">Rejected</option>
          </select>
  
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
  
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {/* Job List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Your Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs added yet.</p>
          ) : (
            <ul className="space-y-2">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{job.company}</p>
                    <p className="text-sm text-gray-600">{job.position}</p>
                  </div>

                  {/* HERE: status dropdown */}
                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(job.id, e.target.value)}
                    className="text-sm capitalize bg-gray-200 px-2 py-1 rounded"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
}

