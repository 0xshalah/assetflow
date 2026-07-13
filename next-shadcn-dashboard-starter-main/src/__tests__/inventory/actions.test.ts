// Mock heavy dependencies before any imports
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('@/lib/auth', () => ({
  requireAdmin: jest.fn()
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    audit: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

jest.mock('@/db/schema/items', () => ({
  items: { id: 'id', name: 'name', category: 'category', quantity: 'quantity' },
  itemCategoryValues: ['lemari-c01', 'lemari-c02', 'lemari-c03']
}));

// Mock drizzle-orm operators
jest.mock('drizzle-orm', () => ({
  eq: jest.fn((col: unknown, val: unknown) => ({ col, val, op: 'eq' })),
  count: jest.fn(() => 'COUNT(*)'),
  sql: jest.fn(() => 'SQL'),
  lt: jest.fn(),
  and: jest.fn(),
  gt: jest.fn()
}));

import { createItem, updateItem, deleteItem } from '@/features/inventory/actions';
import { db } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const mockRequireAdmin = requireAdmin as jest.MockedFunction<typeof requireAdmin>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;
const mockDb = db as jest.Mocked<typeof db>;

const adminUser = { email: 'admin@example.com', id: 'user-1', role: 'admin' as const };

// Helper: build a chainable drizzle mock that resolves with `returnValue`
function makeChainableMock(returnValue: unknown = undefined) {
  const chain: Record<string, jest.Mock> = {};
  const methods = [
    'select',
    'insert',
    'update',
    'delete',
    'from',
    'where',
    'set',
    'values',
    'orderBy'
  ];
  methods.forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  // The last `.where()` or terminal call should resolve
  chain['then'] = jest
    .fn()
    .mockImplementation((resolve: (v: unknown) => unknown) =>
      Promise.resolve(resolve(returnValue))
    );
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockRequireAdmin.mockResolvedValue(adminUser as never);
});

// ─── createItem ──────────────────────────────────────────────────────────────

describe('createItem', () => {
  const validInput = {
    name: 'Pulpen Hitam',
    specification: 'Gel ink',
    category: 'lemari-c01' as const,
    quantity: 10,
    unit: 'pcs',
    supplier: 'Toko ATK',
    receivedAt: '2024-01-15T08:00:00.000Z'
  };

  it('returns success when data is valid and admin is authenticated', async () => {
    // Mock db.insert chain
    const insertChain = {
      values: jest.fn().mockResolvedValue(undefined)
    };
    (mockDb.insert as jest.Mock).mockReturnValue(insertChain);

    const result = await createItem(validInput);
    expect(result.success).toBe(true);
    expect(result.message).toContain('berhasil');
  });

  it('calls requireAdmin', async () => {
    const insertChain = { values: jest.fn().mockResolvedValue(undefined) };
    (mockDb.insert as jest.Mock).mockReturnValue(insertChain);

    await createItem(validInput);
    expect(mockRequireAdmin).toHaveBeenCalledTimes(1);
  });

  it('calls revalidatePath for inventory after creation', async () => {
    const insertChain = { values: jest.fn().mockResolvedValue(undefined) };
    (mockDb.insert as jest.Mock).mockReturnValue(insertChain);

    await createItem(validInput);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/inventory', 'page');
  });

  it('returns validation error for invalid category', async () => {
    const result = await createItem({ ...validInput, category: 'invalid-cat' });
    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it('returns validation error for empty name', async () => {
    const result = await createItem({ ...validInput, name: '' });
    expect(result.success).toBe(false);
  });

  it('returns validation error for quantity = 0', async () => {
    const result = await createItem({ ...validInput, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('returns validation error for missing supplier', async () => {
    const result = await createItem({ ...validInput, supplier: '' });
    expect(result.success).toBe(false);
  });

  it('returns error message when requireAdmin throws Forbidden', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Forbidden'));
    const result = await createItem(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Forbidden');
  });

  it('returns generic error when db.insert throws unexpectedly', async () => {
    const insertChain = { values: jest.fn().mockRejectedValue(new Error('DB error')) };
    (mockDb.insert as jest.Mock).mockReturnValue(insertChain);

    const result = await createItem(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Gagal');
  });
});

// ─── updateItem ──────────────────────────────────────────────────────────────

describe('updateItem', () => {
  const validUpdate = { name: 'Spidol Biru', quantity: 5 };
  const itemId = 'uuid-item-1';

  it('returns success when id and data are valid', async () => {
    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined)
    };
    (mockDb.update as jest.Mock).mockReturnValue(updateChain);

    const result = await updateItem(itemId, validUpdate);
    expect(result.success).toBe(true);
    expect(result.message).toContain('berhasil');
  });

  it('returns error when id is empty', async () => {
    const result = await updateItem('', validUpdate);
    expect(result.success).toBe(false);
    expect(result.message).toContain('ID');
  });

  it('returns validation error for invalid data', async () => {
    const result = await updateItem(itemId, { category: 'bad-cat' });
    expect(result.success).toBe(false);
  });

  it('calls revalidatePath after successful update', async () => {
    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined)
    };
    (mockDb.update as jest.Mock).mockReturnValue(updateChain);

    await updateItem(itemId, validUpdate);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/inventory', 'page');
  });

  it('returns Unauthorized message when requireAdmin throws Unauthorized', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Unauthorized'));
    const result = await updateItem(itemId, validUpdate);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Unauthorized');
  });

  it('returns generic error on db failure', async () => {
    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockRejectedValue(new Error('connection lost'))
    };
    (mockDb.update as jest.Mock).mockReturnValue(updateChain);

    const result = await updateItem(itemId, validUpdate);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Gagal');
  });
});

// ─── deleteItem ──────────────────────────────────────────────────────────────

describe('deleteItem', () => {
  const itemId = 'uuid-item-2';

  it('returns success for valid id', async () => {
    const deleteChain = {
      where: jest.fn().mockResolvedValue(undefined)
    };
    (mockDb.delete as jest.Mock).mockReturnValue(deleteChain);

    const result = await deleteItem(itemId);
    expect(result.success).toBe(true);
  });

  it('returns error when id is empty', async () => {
    const result = await deleteItem('');
    expect(result.success).toBe(false);
    expect(result.message).toContain('ID');
  });

  it('calls revalidatePath after deletion', async () => {
    const deleteChain = { where: jest.fn().mockResolvedValue(undefined) };
    (mockDb.delete as jest.Mock).mockReturnValue(deleteChain);

    await deleteItem(itemId);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/inventory', 'page');
  });

  it('returns Forbidden message when requireAdmin throws Forbidden', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Forbidden'));
    const result = await deleteItem(itemId);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Forbidden');
  });

  it('returns generic error on db failure', async () => {
    const deleteChain = {
      where: jest.fn().mockRejectedValue(new Error('constraint violation'))
    };
    (mockDb.delete as jest.Mock).mockReturnValue(deleteChain);

    const result = await deleteItem(itemId);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Gagal');
  });
});
