import {
  Alert,
  Anchor,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@/api/client';
import { itemsApi } from '@/api/items';
import { reservationsApi } from '@/api/reservations';
import { wishlistsApi } from '@/api/wishlists';
import { NewItemModal } from '@/components/NewItemModal';
import { ReserveModal } from '@/components/ReserveModal';
import { WishItemCard } from '@/components/WishItemCard';
import { useAuth } from '@/hooks/useAuth';
import type { WishItem, WishlistDetails } from '@/types/api';
import { formatDate } from '@/utils/format';

export function WishlistPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState<WishlistDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [reserveItem, setReserveItem] = useState<WishItem | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await wishlistsApi.getById(id);
      setWishlist(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не вдалося завантажити');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const isOwner = Boolean(user && wishlist && wishlist.userId === user.id);

  async function handleDeleteItem(itemId: string) {
    modals.openConfirmModal({
      title: 'Видалити бажання?',
      children: <Text size="sm">Цю дію не можна скасувати.</Text>,
      labels: { confirm: 'Видалити', cancel: 'Скасувати' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await itemsApi.remove(itemId);
          await load();
        } catch (err) {
          notifications.show({
            color: 'red',
            title: 'Не вдалося видалити',
            message: err instanceof ApiError ? err.message : 'Невідома помилка',
          });
        }
      },
    });
  }

  async function handleCancelReserve(itemId: string) {
    try {
      await reservationsApi.cancel(itemId);
      await load();
      notifications.show({ color: 'teal', message: 'Бронь скасовано' });
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Не вдалося скасувати',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    }
  }

  function handleDeleteWishlist() {
    if (!wishlist) return;
    modals.openConfirmModal({
      title: 'Видалити вішліст?',
      children: (
        <Text size="sm">
          Усі бажання та бронювання буде видалено. Цю дію не можна скасувати.
        </Text>
      ),
      labels: { confirm: 'Видалити', cancel: 'Скасувати' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await wishlistsApi.remove(wishlist.id);
          navigate('/');
        } catch (err) {
          notifications.show({
            color: 'red',
            title: 'Не вдалося видалити',
            message: err instanceof ApiError ? err.message : 'Невідома помилка',
          });
        }
      },
    });
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Anchor component={Link} to="/" c="dimmed">
          <Group gap={4}>
            <IconArrowLeft size={14} />
            <Text size="sm">назад</Text>
          </Group>
        </Anchor>
        <Alert color="red" icon={<IconAlertCircle size={16} />} mt="md" title="Упс">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!wishlist) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Anchor component={Link} to="/" c="dimmed" mb="md">
        <Group gap={4}>
          <IconArrowLeft size={14} />
          <Text size="sm">назад</Text>
        </Group>
      </Anchor>

      <Stack gap="xs" mb="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={1}>{wishlist.title}</Title>
          <Badge
            variant="light"
            color={wishlist.isPublic ? 'brand' : 'gray'}
            size="lg"
          >
            {wishlist.isPublic ? 'публічний' : 'приватний'}
          </Badge>
        </Group>

        <Group gap="md" c="dimmed">
          {wishlist.occasion && <Text size="sm">{wishlist.occasion}</Text>}
          {wishlist.eventDate && (
            <Group gap={4}>
              <IconCalendar size={14} />
              <Text size="sm">{formatDate(wishlist.eventDate)}</Text>
            </Group>
          )}
          <Text size="sm">від {wishlist.user.fullName}</Text>
        </Group>

        {wishlist.description && <Text>{wishlist.description}</Text>}
      </Stack>

      {isOwner && (
        <Group mb="lg">
          <Button leftSection={<IconPlus size={14} />} onClick={() => setAddItemOpen(true)}>
            Додати бажання
          </Button>
          <Button
            color="red"
            variant="light"
            leftSection={<IconTrash size={14} />}
            onClick={handleDeleteWishlist}
          >
            Видалити вішліст
          </Button>
        </Group>
      )}

      {wishlist.wishItems.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">
            {isOwner ? 'Ще немає бажань. Додайте перше ⬆' : 'Тут поки порожньо.'}
          </Text>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {wishlist.wishItems.map((item) => (
            <WishItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              currentUserId={user?.id ?? null}
              onReserveClick={setReserveItem}
              onCancelReserve={handleCancelReserve}
              onDelete={handleDeleteItem}
            />
          ))}
        </SimpleGrid>
      )}

      <NewItemModal
        wishlistId={wishlist.id}
        opened={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onCreated={() => {
          void load();
        }}
      />

      <ReserveModal
        item={reserveItem}
        opened={reserveItem !== null}
        onClose={() => setReserveItem(null)}
        onSuccess={() => {
          void load();
        }}
      />
    </Container>
  );
}
