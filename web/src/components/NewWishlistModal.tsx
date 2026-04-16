import {
  Button,
  Checkbox,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { ApiError } from '@/api/client';
import { wishlistsApi } from '@/api/wishlists';
import type { Wishlist } from '@/types/api';

interface Props {
  opened: boolean;
  onClose: () => void;
  onCreated: (wishlist: Wishlist) => void;
}

interface FormValues {
  title: string;
  description: string;
  occasion: string;
  eventDate: Date | null;
  isPublic: boolean;
}

export function NewWishlistModal({ opened, onClose, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      description: '',
      occasion: '',
      eventDate: null,
      isPublic: true,
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? 'Вкажіть назву' : null),
    },
  });

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const created = await wishlistsApi.create({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        occasion: values.occasion.trim() || undefined,
        eventDate: values.eventDate
          ? values.eventDate.toISOString().slice(0, 10)
          : undefined,
        isPublic: values.isPublic,
      });
      onCreated(created);
      form.reset();
      onClose();
      notifications.show({
        color: 'teal',
        title: 'Готово',
        message: `Вішліст «${created.title}» створено`,
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Не вдалося створити вішліст',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Новий вішліст" centered size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Назва"
            placeholder="День народження"
            required
            maxLength={120}
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Опис"
            autosize
            minRows={2}
            maxLength={1000}
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Привід"
            placeholder="birthday, wedding…"
            maxLength={60}
            {...form.getInputProps('occasion')}
          />
          <DateInput
            label="Дата події"
            placeholder="Оберіть дату"
            clearable
            {...form.getInputProps('eventDate')}
          />
          <Checkbox
            label="Публічний (видно за посиланням)"
            {...form.getInputProps('isPublic', { type: 'checkbox' })}
          />
          <Button type="submit" loading={submitting}>
            Створити
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
