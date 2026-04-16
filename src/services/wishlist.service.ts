import { prisma } from '../config/prisma';
import { HttpError } from '../utils/HttpError';
import type { CreateWishlistInput, UpdateWishlistInput } from '../schemas/wishlist.schema';

function toEventDate(value: string | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  return new Date(value);
}

export const wishlistService = {
  async listMine(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { wishItems: true } } },
    });
  },

  async getById(id: string, viewerId: string | undefined) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id },
      include: {
        wishItems: {
          orderBy: { createdAt: 'asc' },
          include: { reservation: true },
        },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (!wishlist) throw new HttpError(404, 'Wishlist not found');

    if (!wishlist.isPublic && wishlist.userId !== viewerId) {
      throw new HttpError(403, 'Цей вішліст приватний');
    }

    return wishlist;
  },

  async create(userId: string, input: CreateWishlistInput) {
    return prisma.wishlist.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        occasion: input.occasion ?? null,
        isPublic: input.isPublic ?? true,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
      },
    });
  },

  async update(id: string, userId: string, input: UpdateWishlistInput) {
    const existing = await prisma.wishlist.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, 'Wishlist not found');
    if (existing.userId !== userId) throw new HttpError(403, 'Forbidden');

    return prisma.wishlist.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.occasion !== undefined && { occasion: input.occasion }),
        ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
        ...(input.eventDate !== undefined && { eventDate: toEventDate(input.eventDate) }),
      },
    });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.wishlist.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, 'Wishlist not found');
    if (existing.userId !== userId) throw new HttpError(403, 'Forbidden');

    await prisma.wishlist.delete({ where: { id } });
  },
};
