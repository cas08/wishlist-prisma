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
  fullName: string;
  password: string;
}

export function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { email: '', fullName: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Невалідний email'),
      fullName: (value) => (value.trim().length === 0 ? 'Вкажіть ім\'я' : null),
      password: (value) => (value.length < 6 ? 'Мін. 6 символів' : null),
    },
  });

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const { token, user } = await authApi.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName.trim(),
      });
      setAuth(token, user);
      navigate('/');
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Реєстрація не вдалася',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container size={420} py="xl">
      <Title ta="center" order={2}>
        Реєстрація
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
            <TextInput
              label="Повне ім'я"
              placeholder="Богдан Рудник"
              required
              {...form.getInputProps('fullName')}
            />
            <PasswordInput
              label="Пароль"
              description="Мінімум 6 символів"
              required
              autoComplete="new-password"
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth loading={submitting}>
              Створити акаунт
            </Button>
            <Anchor component={Link} to="/login" ta="center" size="sm">
              Уже є акаунт? Увійти
            </Anchor>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
