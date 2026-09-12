import { fetchApi } from './api';
import type { UserProfile, CareerRole, StudentCohortMetric, SkillItem } from '../types';

export const userService = {
  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    return fetchApi('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async setTargetRole(role: CareerRole): Promise<{ success: boolean; user: UserProfile; skills?: SkillItem[] }> {
    return fetchApi('/users/target-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  async getCohortStudents(): Promise<{ success: boolean; students: StudentCohortMetric[] }> {
    return fetchApi('/admin/students');
  }
};
