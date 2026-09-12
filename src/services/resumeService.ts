import { fetchApi } from './api';
import type { UserProfile } from '../types';

export const resumeService = {
  async uploadResumeFile(file: File): Promise<{ success: boolean; user: UserProfile; resume: any }> {
    const formData = new FormData();
    formData.append('resume', file);

    return fetchApi('/resumes/upload', {
      method: 'POST',
      body: formData
    });
  }
};
