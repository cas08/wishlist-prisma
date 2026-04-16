import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconCalendar, IconGift } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { WishlistListItem } from '@/types/api';
import { formatDate } from '@/utils/format';

interface Props {
  wishlist: WishlistListItem;
}

export function WishlistCard({ wishlist }: Props) {
  const itemCount = wishlist._count?.wishItems ?? 0;

  return (
    <Card
      component={Link}
      to={`/wishlist/${wishlist.id}`}
      withBorder
      padding="lg"
      radius="md"
      shadow="sm"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={4} lineClamp={2}>
            {wishlist.title}
          </Title>
          <Badge
            variant="light"
            color={wishlist.isPublic ? 'brand' : 'gray'}
            size="sm"
          >
            {wishlist.isPublic ? 'публічний' : 'приватний'}
          </Badge>
        </Group>

        {wishlist.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {wishlist.description}
          </Text>
        )}

        <Group gap="xs" mt="xs">
          {wishlist.occasion && (
            <Badge variant="outline" size="xs">
              {wishlist.occasion}
            </Badge>
          )}
          {wishlist.eventDate && (
            <Group gap={4} wrap="nowrap">
              <IconCalendar size={14} />
              <Text size="xs" c="dimmed">
                {formatDate(wishlist.eventDate)}
              </Text>
            </Group>
          )}
          <Group gap={4} wrap="nowrap" ml="auto">
            <IconGift size={14} />
            <Text size="xs" c="dimmed">
              {itemCount} {itemCount === 1 ? 'бажання' : 'бажань'}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
