import { prisma } from '../config/prisma';
import { HttpError } from '../utils/HttpError';
import type { ReserveInput } from '../schemas/reservation.schema';

export const reservationService = {
  async reserve(wishItemId: string, userId: string | undefined, input: ReserveInput) {
    const item = await prisma.wishItem.findUnique({
      where: { id: wishItemId },
      include: { reservation: true },
    });
    if (!item) throw new HttpError(404, 'Не знайдено');
    if (item.reservation || item.status === 'reserved') {
      throw new HttpError(409, 'Цей подарунок уже заброньовано');
    }

    let reserverName: string | null = input.reserverName ?? null;

    if (userId) {
      if (!input.isAnonymous && !reserverName) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { fullName: true },
        });
        reserverName = user?.fullName ?? null;
      }
    } else {
      if (!reserverName) {
        throw new HttpError(400, 'reserverName обовʼязкове для анонімного бронювання');
      }
    }

    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          wishItemId,
          reserverId: userId ?? null,
          reserverName,
          note: input.note ?? null,
          isAnonymous: input.isAnonymous ?? !userId,
        },
      });
      await tx.wishItem.update({
        where: { id: wishItemId },
        data: { status: 'reserved' },
      });
      return reservation;
    });
  },

  async cancel(wishItemId: string, userId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { wishItemId },
    });
    if (!reservation) throw new HttpError(404, 'Reservation not found');
    if (reservation.reserverId !== userId) {
      throw new HttpError(403, 'Скасувати може лише той, хто бронював');
    }

    await prisma.$transaction([
      prisma.reservation.delete({ where: { wishItemId } }),
      prisma.wishItem.update({
        where: { id: wishItemId },
        data: { status: 'free' },
      }),
    ]);
  },
};
