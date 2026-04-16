import { AppShell, Burger, Button, Group, Text, Menu, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconGift, IconLogout, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function TopBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group gap={8}>
              <IconGift size={22} />
              <Text fw={700} size="lg">
                Wishlist
              </Text>
            </Group>
          </Link>
        </Group>

        <Group>
          {isAuthenticated && user ? (
            <Menu shadow="md" width={220}>
              <Menu.Target>
                <Group gap="xs" style={{ cursor: 'pointer' }}>
                  <Avatar radius="xl" size="sm" color="brand">
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text size="sm" visibleFrom="sm">
                    {user.email}
                  </Text>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user.fullName}</Menu.Label>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate('/')}
                >
                  Мої вішлісти
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Вийти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <Button component={Link} to="/login" variant="subtle">
                Увійти
              </Button>
              <Button component={Link} to="/register">
                Реєстрація
              </Button>
            </>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
}
