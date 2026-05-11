import { z } from 'zod';
import { itemCategoryValues } from '@/db/schema/items';

export const createItemSchema = z
  .object({
    name: z.string().min(1, 'Nama barang wajib diisi.').max(200).trim(),
    category: z.enum(itemCategoryValues, {
      errorMap: () => ({ message: 'Kategori harus elektrik, mekanik, atau facility.' })
    }),
    quantity: z.number().int().min(1, 'Jumlah minimal 1.').max(99999),
    supplier: z.string().min(1, 'Supplier wajib diisi.').max(200).trim()
  })
  .strict();

export const updateItemSchema = z
  .object({
    name: z.string().min(1).max(200).trim().optional(),
    category: z.enum(itemCategoryValues).optional(),
    quantity: z.number().int().min(0).max(99999).optional(),
    supplier: z.string().min(1).max(200).trim().optional()
  })
  .strict();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
