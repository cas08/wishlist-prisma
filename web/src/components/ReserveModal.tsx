import { Button, Modal, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { ApiError } from '@/api/client';
import { reservationsApi } from '@/api/reservations';
import { useAuth } from '@/hooks/useAuth';
import type { WishItem } from '@/types/api';

interface Props {
  item: WishItem | null;
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  reserverName: string;
  note: string;
}

export function ReserveModal({ item, opened, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { reserverName: '', note: '' },
    validate: {
      reserverName: (value) =>
        !user && !value.trim() ? 'Вкажіть, будь ласка, ваше ім\'я' : null,
    },
  });

  async function handleSubmit(values: FormValues) {
    if (!item) return;
    setSubmitting(true);
    try {
      await reservationsApi.reserve(item.id, {
        reserverName: values.reserverName.trim() || undefined,
        note: values.note.trim() || undefined,
      });
      notifications.show({
        color: 'teal',
        title: 'Заброньовано',
        message: `«${item.title}» - ваше!`,
      });
      form.reset();
      onSuccess();
      onClose();
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Не вдалося забронювати',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Забронювати подарунок"
      centered
      size="md"
    >
      {item && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Text size="sm" c="dimmed">
              {item.title}
            </Text>

            {!user && (
              <TextInput
                label="Ваше ім'я"
                placeholder="Богдан"
                required
                {...form.getInputProps('reserverName')}
              />
            )}

            <Textarea
              label="Примітка (необов'язково)"
              placeholder="Куплю до суботи"
              autosize
              minRows={2}
              {...form.getInputProps('note')}
            />

            <Button type="submit" loading={submitting}>
              Забронювати
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
