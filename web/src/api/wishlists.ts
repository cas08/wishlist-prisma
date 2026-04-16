import { apiRequest } from './client';
import type {
  CreateWishlistInput,
  UpdateWishlistInput,
  Wishlist,
  WishlistDetails,
  WishlistListItem,
} from '@/types/api';

export const wishlistsApi = {
  listMine() {
    return apiRequest<WishlistListItem[]>('/wishlists');
  },
  getById(id: string) {
    return apiRequest<WishlistDetails>(`/wishlists/${id}`, { auth: true });
  },
  create(input: CreateWishlistInput) {
    return apiRequest<Wishlist>('/wishlists', { method: 'POST', body: input });
  },
  update(id: string, input: UpdateWishlistInput) {
    return apiRequest<Wishlist>(`/wishlists/${id}`, { method: 'PATCH', body: input });
  },
  remove(id: string) {
    return apiRequest<void>(`/wishlists/${id}`, { method: 'DELETE' });
  },
};
