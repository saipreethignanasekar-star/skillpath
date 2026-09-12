import { fetchApi } from './api';
import type { ChallengeItem, ChallengeEvaluation, UserProfile } from '../types';

export const challengeService = {
  async getChallenges(): Promise<{ success: boolean; challenges: ChallengeItem[] }> {
    return fetchApi('/challenges');
  },

  async submitCode(challengeId: string, code: string): Promise<{
    success: boolean;
    evaluation: ChallengeEvaluation;
    user: UserProfile;
  }> {
    return fetchApi(`/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }
};
