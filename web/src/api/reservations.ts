import { apiRequest } from './client';
import type { Reservation, ReserveInput } from '@/types/api';
import { tokenStorage } from './client';

export const reservationsApi = {
  reserve(itemId: string, input: ReserveInput) {
    return apiRequest<Reservation>(`/items/${itemId}/reserve`, {
      method: 'POST',
      body: input,
      auth: Boolean(tokenStorage.get()),
    });
  },
  cancel(itemId: string) {
    return apiRequest<void>(`/items/${itemId}/reserve`, { method: 'DELETE' });
  },
};
