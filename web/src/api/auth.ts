import { apiRequest } from './client';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/api';

export const authApi = {
  register(input: RegisterInput) {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
      auth: false,
    });
  },
  login(input: LoginInput) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
      auth: false,
    });
  },
  me() {
    return apiRequest<User>('/auth/me');
  },
};
