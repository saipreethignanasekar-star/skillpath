import { fetchApi } from './api';
import type { SkillItem } from '../types';

export const skillService = {
  async getSkills(): Promise<{ success: boolean; skills: SkillItem[] }> {
    return fetchApi('/skills');
  },

  async addSkill(skill: Partial<SkillItem>): Promise<{ success: boolean; skill: SkillItem }> {
    return fetchApi('/skills', {
      method: 'POST',
      body: JSON.stringify(skill)
    });
  }
};
