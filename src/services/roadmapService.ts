import { fetchApi } from './api';
import type { RoadmapPhase, UserProfile } from '../types';

export const roadmapService = {
  async getRoadmap(): Promise<{ success: boolean; roadmap: { phases: RoadmapPhase[] } }> {
    return fetchApi('/roadmap');
  },

  async completeModule(phaseId: string, moduleId: string): Promise<{ success: boolean; user: UserProfile; roadmap: { phases: RoadmapPhase[] } }> {
    return fetchApi('/roadmap/modules/complete', {
      method: 'POST',
      body: JSON.stringify({ phaseId, moduleId })
    });
  }
};
