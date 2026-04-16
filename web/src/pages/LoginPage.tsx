import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';

interface FormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Невалідний email'),
      password: (value) => (value.length < 1 ? 'Введіть пароль' : null),
    },
  });

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const { token, user } = await authApi.login(values);
      setAuth(token, user);
      navigate('/');
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Не вдалося увійти',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container size={420} py="xl">
      <Title ta="center" order={2}>
        Вхід
      </Title>

      <Paper withBorder shadow="sm" p="xl" mt="lg" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Пароль"
              required
              autoComplete="current-password"
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth loading={submitting}>
              Увійти
            </Button>
            <Anchor component={Link} to="/register" ta="center" size="sm">
              Немає акаунта? Зареєструватися
            </Anchor>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
