import { fetchApi } from './api';
import type { JobItem } from '../types';

export const jobService = {
  async getJobs(): Promise<{ success: boolean; jobs: JobItem[] }> {
    return fetchApi('/jobs');
  },

  async applyForJob(jobId: string): Promise<{ success: boolean }> {
    return fetchApi(`/jobs/${jobId}/apply`, {
      method: 'POST'
    });
  }
};
