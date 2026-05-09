import { z } from 'zod';

export const createLoanSchema = z.object({
  itemId: z.string().uuid('Item ID tidak valid.'),
  borrowerName: z
    .string()
    .min(1, 'Nama peminjam wajib diisi.')
    .max(100, 'Nama peminjam maksimal 100 karakter.')
    .trim(),
  borrowerContact: z
    .string()
    .min(1, 'Kontak peminjam wajib diisi.')
    .max(100, 'Kontak maksimal 100 karakter.')
    .trim()
});

export const loanIdSchema = z.object({
  loanId: z.string().uuid('Loan ID tidak valid.')
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
