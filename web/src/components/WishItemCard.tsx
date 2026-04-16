import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconExternalLink,
  IconTrash,
  IconBookmark,
  IconBookmarkOff,
} from '@tabler/icons-react';
import type { Priority, WishItem } from '@/types/api';
import { formatPrice } from '@/utils/format';

interface Props {
  item: WishItem;
  isOwner: boolean;
  currentUserId: string | null;
  onReserveClick: (item: WishItem) => void;
  onCancelReserve: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'gray',
  medium: 'brand',
  high: 'red',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'низький',
  medium: 'середній',
  high: 'високий',
};

export function WishItemCard({
  item,
  isOwner,
  currentUserId,
  onReserveClick,
  onCancelReserve,
  onDelete,
}: Props) {
  const priceText = formatPrice(item.price, item.currency);
  const isReserved = item.status === 'reserved';
  const isMyReservation =
    isReserved && currentUserId !== null && item.reservation?.reserverId === currentUserId;

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Stack gap="sm" h="100%">
        {item.imageUrl && (
          <Card.Section>
            <Image src={item.imageUrl} alt={item.title} h={160} fit="cover" fallbackSrc="" />
          </Card.Section>
        )}

        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={5} lineClamp={2}>
            {item.title}
          </Title>
          <Badge color={PRIORITY_COLORS[item.priority]} variant="light" size="sm">
            {PRIORITY_LABEL[item.priority]}
          </Badge>
        </Group>

        {item.description && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {item.description}
          </Text>
        )}

        {priceText && (
          <Text size="sm" fw={500}>
            {priceText}
          </Text>
        )}

        {isReserved && (
          <Badge
            color="teal"
            variant="light"
            leftSection={<IconBookmark size={12} />}
          >
            Заброньовано
            {item.reservation?.reserverName ? `: ${item.reservation.reserverName}` : ''}
          </Badge>
        )}

        <Group gap="xs" mt="auto">
          {!isReserved && !isOwner && (
            <Button
              size="xs"
              leftSection={<IconBookmark size={14} />}
              onClick={() => onReserveClick(item)}
            >
              Забронювати
            </Button>
          )}

          {isMyReservation && (
            <Button
              size="xs"
              variant="light"
              color="red"
              leftSection={<IconBookmarkOff size={14} />}
              onClick={() => onCancelReserve(item.id)}
            >
              Скасувати бронь
            </Button>
          )}

          {item.url && (
            <Tooltip label="Відкрити посилання">
              <ActionIcon
                component="a"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                size="lg"
              >
                <IconExternalLink size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {isOwner && (
            <Tooltip label="Видалити">
              <ActionIcon
                variant="light"
                color="red"
                size="lg"
                onClick={() => onDelete(item.id)}
                ml="auto"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
