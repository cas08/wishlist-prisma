import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconGift, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [wishlistId, setWishlistId] = useState('');

  function openWishlist() {
    const trimmed = wishlistId.trim();
    if (trimmed) navigate(`/wishlist/${trimmed}`);
  }

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl" py="xl">
        <Box ta="center">
          <IconGift size={56} stroke={1.5} />
          <Title order={1} mt="md" size={46}>
            Жодних подвійних подарунків
          </Title>
          <Text c="dimmed" size="lg" mt="md" maw={560} mx="auto">
            Створіть список бажань, поділіться посиланням - і гості бронюють те, що
            дарують. Ніяких спойлерів, ніяких дублікатів.
          </Text>
        </Box>

        <Group>
          <Button component={Link} to="/register" size="md">
            Зареєструватися
          </Button>
          <Button component={Link} to="/login" variant="default" size="md">
            Увійти
          </Button>
        </Group>

        <Paper withBorder shadow="sm" radius="md" p="lg" w="100%" maw={460}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Є посилання на чужий вішліст?
            </Text>
            <Group wrap="nowrap" gap="xs">
              <TextInput
                placeholder="UUID вішліста"
                value={wishlistId}
                onChange={(e) => setWishlistId(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && openWishlist()}
                style={{ flex: 1 }}
              />
              <Button
                leftSection={<IconSearch size={14} />}
                onClick={openWishlist}
                disabled={!wishlistId.trim()}
              >
                Відкрити
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
