import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { ApiError } from '@/api/client';
import { itemsApi } from '@/api/items';
import type { Priority, WishItem } from '@/types/api';

interface Props {
  wishlistId: string;
  opened: boolean;
  onClose: () => void;
  onCreated: (item: WishItem) => void;
}

interface FormValues {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  price: number | '';
  currency: string;
  priority: Priority;
}

export function NewItemModal({ wishlistId, opened, onClose, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      description: '',
      url: '',
      imageUrl: '',
      price: '',
      currency: 'USD',
      priority: 'medium',
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? 'Вкажіть назву' : null),
      url: (value) => (value && !isValidUrl(value) ? 'Невалідний URL' : null),
      imageUrl: (value) => (value && !isValidUrl(value) ? 'Невалідний URL' : null),
    },
  });

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const created = await itemsApi.create(wishlistId, {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        url: values.url.trim() || undefined,
        imageUrl: values.imageUrl.trim() || undefined,
        price: values.price === '' ? undefined : Number(values.price),
        currency: values.currency.trim() || undefined,
        priority: values.priority,
      });
      onCreated(created);
      form.reset();
      onClose();
      notifications.show({
        color: 'teal',
        title: 'Додано',
        message: `«${created.title}» у вішлісті`,
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Не вдалося створити бажання',
        message: err instanceof ApiError ? err.message : 'Невідома помилка',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Нове бажання" centered size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Назва"
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
            label="Посилання (URL)"
            placeholder="https://example.com/item"
            {...form.getInputProps('url')}
          />
          <TextInput
            label="Картинка (URL)"
            placeholder="https://…/image.jpg"
            {...form.getInputProps('imageUrl')}
          />
          <Group grow>
            <NumberInput
              label="Ціна"
              min={0}
              step={0.01}
              decimalScale={2}
              {...form.getInputProps('price')}
            />
            <TextInput
              label="Валюта"
              maxLength={3}
              {...form.getInputProps('currency')}
            />
            <Select
              label="Пріоритет"
              data={[
                { value: 'low', label: 'низький' },
                { value: 'medium', label: 'середній' },
                { value: 'high', label: 'високий' },
              ]}
              allowDeselect={false}
              {...form.getInputProps('priority')}
            />
          </Group>
          <Button type="submit" loading={submitting}>
            Додати
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
