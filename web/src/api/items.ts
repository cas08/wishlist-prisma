import { apiRequest } from './client';
import type { CreateWishItemInput, UpdateWishItemInput, WishItem } from '@/types/api';

export const itemsApi = {
  create(wishlistId: string, input: CreateWishItemInput) {
    return apiRequest<WishItem>(`/wishlists/${wishlistId}/items`, {
      method: 'POST',
      body: input,
    });
  },
  update(id: string, input: UpdateWishItemInput) {
    return apiRequest<WishItem>(`/items/${id}`, { method: 'PATCH', body: input });
  },
  remove(id: string) {
    return apiRequest<void>(`/items/${id}`, { method: 'DELETE' });
  },
};
