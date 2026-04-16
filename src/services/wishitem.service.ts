import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../config/prisma';
import { HttpError } from '../utils/HttpError';
import type { CreateWishItemInput, UpdateWishItemInput } from '../schemas/wishitem.schema';

async function assertWishlistOwner(wishlistId: string, userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { id: true, userId: true },
  });
  if (!wishlist) throw new HttpError(404, 'Wishlist not found');
  if (wishlist.userId !== userId) throw new HttpError(403, 'Forbidden');
}

async function getItemWithOwner(id: string) {
  const item = await prisma.wishItem.findUnique({
    where: { id },
    include: { wishlist: { select: { userId: true } } },
  });
  if (!item) throw new HttpError(404, 'Item not found');
  return item;
}

export const wishItemService = {
  async create(wishlistId: string, userId: string, input: CreateWishItemInput) {
    await assertWishlistOwner(wishlistId, userId);

    return prisma.wishItem.create({
      data: {
        wishlistId,
        title: input.title,
        description: input.description ?? null,
        url: input.url ?? null,
        imageUrl: input.imageUrl ?? null,
        price: input.price !== undefined ? new Prisma.Decimal(input.price) : null,
        currency: input.currency ?? 'USD',
        priority: input.priority ?? 'medium',
      },
    });
  },

  async update(id: string, userId: string, input: UpdateWishItemInput) {
    const item = await getItemWithOwner(id);
    if (item.wishlist.userId !== userId) throw new HttpError(403, 'Forbidden');

    return prisma.wishItem.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.url !== undefined && { url: input.url }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.price !== undefined && { price: new Prisma.Decimal(input.price) }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.priority !== undefined && { priority: input.priority }),
      },
    });
  },

  async remove(id: string, userId: string) {
    const item = await getItemWithOwner(id);
    if (item.wishlist.userId !== userId) throw new HttpError(403, 'Forbidden');

    await prisma.wishItem.delete({ where: { id } });
  },
};
