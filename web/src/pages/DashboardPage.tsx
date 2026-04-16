import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/api/client';
import { wishlistsApi } from '@/api/wishlists';
import { NewWishlistModal } from '@/components/NewWishlistModal';
import { WishlistCard } from '@/components/WishlistCard';
import { useAuth } from '@/hooks/useAuth';
import type { WishlistListItem } from '@/types/api';

export function DashboardPage() {
  const { logout } = useAuth();
  const [items, setItems] = useState<WishlistListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await wishlistsApi.listMine();
      setItems(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Не вдалося завантажити');
    }
  }, [logout]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Мої вішлісти</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          Новий
        </Button>
      </Group>

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} mb="md">
          {error}
        </Alert>
      )}

      {items === null ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : items.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">Ще жодного вішліста. Створіть перший ⬆</Text>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {items.map((wl) => (
            <WishlistCard key={wl.id} wishlist={wl} />
          ))}
        </SimpleGrid>
      )}

      <NewWishlistModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          void load();
        }}
      />
    </Container>
  );
}
