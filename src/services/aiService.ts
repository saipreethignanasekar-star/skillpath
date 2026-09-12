import { fetchApi } from './api';
import type { ChatMessage } from '../types';

export const aiService = {
  async getMessages(): Promise<{ success: boolean; messages: ChatMessage[] }> {
    return fetchApi('/chat/messages');
  },

  async sendMessage(text: string): Promise<{
    success: boolean;
    userMessage: ChatMessage;
    aiMessage: ChatMessage;
    messages: ChatMessage[];
  }> {
    return fetchApi('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }
};
