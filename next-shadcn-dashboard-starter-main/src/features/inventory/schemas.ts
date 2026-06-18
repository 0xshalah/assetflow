import { z } from 'zod';
import { itemCategoryValues } from '@/db/schema/items';

export const createItemSchema = z
  .object({
    name: z.string().min(1, 'Nama barang wajib diisi.').max(200).trim(),
    specification: z.string().max(500).trim().default(''),
    category: z.enum(itemCategoryValues, {
      message: 'Kategori harus Lemari C-01, C-02, atau C-03.'
    }),
    quantity: z.number().int().min(1, 'Jumlah minimal 1.').max(99999),
    unit: z.string().min(1, 'Unit wajib diisi.').max(50).trim(),
    supplier: z.string().min(1, 'Supplier wajib diisi.').max(200).trim(),
    receivedAt: z.string().min(1, 'Tanggal masuk wajib diisi.'),
    minimumStock: z.number().int().min(0, 'Minimal 0.').max(99999).default(0)
  })
  .strict();

export const updateItemSchema = z
  .object({
    name: z.string().min(1).max(200).trim().optional(),
    specification: z.string().max(500).trim().optional(),
    category: z.enum(itemCategoryValues).optional(),
    quantity: z.number().int().min(0).max(99999).optional(),
    unit: z.string().min(1).max(50).trim().optional(),
    supplier: z.string().min(1).max(200).trim().optional(),
    receivedAt: z.string().optional(),
    minimumStock: z.number().int().min(0).max(99999).optional()
  })
  .strict();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
