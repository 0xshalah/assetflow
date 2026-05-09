import { z } from 'zod';
import { itemStatusValues } from '@/db/schema/items';

export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama barang wajib diisi.')
    .max(200, 'Nama barang maksimal 200 karakter.')
    .trim(),
  category: z.enum(['Elektronik', 'Aksesoris', 'Furniture', 'Networking', 'Lainnya'], {
    errorMap: () => ({ message: 'Kategori tidak valid.' })
  })
});

export const updateItemSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  category: z.enum(['Elektronik', 'Aksesoris', 'Furniture', 'Networking', 'Lainnya']).optional(),
  status: z.enum(itemStatusValues).optional()
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
