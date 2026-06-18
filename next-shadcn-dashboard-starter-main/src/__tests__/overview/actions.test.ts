'use server';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/lib/auth', () => ({
  requireAdmin: jest.fn().mockResolvedValue(undefined)
}));

const mockDbSelect = jest.fn();
const mockFrom = jest.fn();
const mockWhere = jest.fn();

// Chain builder: each call returns an object with the next methods
function makeChain(resolvedValue: unknown) {
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.from = jest.fn().mockReturnValue(chain);
  chain.where = jest.fn().mockResolvedValue(resolvedValue);
  return chain;
}

// We intercept `db` as a mock object where `.select()` starts the chain
let callIndex = 0;
const queryResults: Array<{ value: number }[]> = [];

jest.mock('@/db', () => ({
  db: {
    select: jest.fn((...args: unknown[]) => {
      const result = queryResults[callIndex] ?? [{ value: 0 }];
      callIndex++;
      return {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(result)
        })
      };
    })
  }
}));

jest.mock('@/db/schema/items', () => ({
  items: { category: 'category', quantity: 'quantity' }
}));

jest.mock('@/db/schema/loans', () => ({
  loans: { status: 'status' }
}));

jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  count: jest.fn(),
  sql: jest.fn(),
  lt: jest.fn(),
  lte: jest.fn(),
  and: jest.fn(),
  gt: jest.fn()
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import { getDashboardMetrics } from '@/features/overview/actions';
import { requireAdmin } from '@/lib/auth';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('getDashboardMetrics', () => {
  beforeEach(() => {
    callIndex = 0;
    queryResults.length = 0;
    jest.clearAllMocks();
    // Reset requireAdmin mock
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
  });

  it('calls requireAdmin before fetching metrics', async () => {
    // Provide 6 results for 6 DB queries
    queryResults.push(
      [{ value: 10 }], // lemariC01
      [{ value: 20 }], // lemariC02
      [{ value: 30 }], // lemariC03
      [{ value: 2 }], // outOfStock
      [{ value: 5 }], // activeLoans
      [{ value: 3 }] // lowStockItems
    );

    await getDashboardMetrics();
    expect(requireAdmin).toHaveBeenCalledTimes(1);
  });

  it('throws if requireAdmin rejects (unauthorized)', async () => {
    (requireAdmin as jest.Mock).mockRejectedValue(new Error('Unauthorized'));
    await expect(getDashboardMetrics()).rejects.toThrow('Unauthorized');
  });

  it('returns numeric values for all metric keys', async () => {
    queryResults.push(
      [{ value: 10 }],
      [{ value: 20 }],
      [{ value: 30 }],
      [{ value: 2 }],
      [{ value: 5 }],
      [{ value: 3 }]
    );

    const metrics = await getDashboardMetrics();
    expect(typeof metrics.totalLemariC01).toBe('number');
    expect(typeof metrics.totalLemariC02).toBe('number');
    expect(typeof metrics.totalLemariC03).toBe('number');
    expect(typeof metrics.outOfStock).toBe('number');
    expect(typeof metrics.activeLoans).toBe('number');
    expect(typeof metrics.lowStockItems).toBe('number');
  });

  it('returns correct values from DB results', async () => {
    queryResults.push(
      [{ value: 10 }],
      [{ value: 20 }],
      [{ value: 30 }],
      [{ value: 2 }],
      [{ value: 5 }],
      [{ value: 3 }]
    );

    const metrics = await getDashboardMetrics();
    expect(metrics.totalLemariC01).toBe(10);
    expect(metrics.totalLemariC02).toBe(20);
    expect(metrics.totalLemariC03).toBe(30);
    expect(metrics.outOfStock).toBe(2);
    expect(metrics.activeLoans).toBe(5);
    expect(metrics.lowStockItems).toBe(3);
  });

  it('returns 0 for all metrics when DB has no data', async () => {
    queryResults.push(
      [{ value: 0 }],
      [{ value: 0 }],
      [{ value: 0 }],
      [{ value: 0 }],
      [{ value: 0 }],
      [{ value: 0 }]
    );

    const metrics = await getDashboardMetrics();
    expect(metrics.totalLemariC01).toBe(0);
    expect(metrics.totalLemariC02).toBe(0);
    expect(metrics.totalLemariC03).toBe(0);
    expect(metrics.outOfStock).toBe(0);
    expect(metrics.activeLoans).toBe(0);
    expect(metrics.lowStockItems).toBe(0);
  });

  it('lowStockItems counts items where 0 < quantity <= minimumStock', async () => {
    // Simulate: 4 low-stock items
    queryResults.push(
      [{ value: 50 }],
      [{ value: 30 }],
      [{ value: 20 }],
      [{ value: 1 }],
      [{ value: 0 }],
      [{ value: 4 }]
    );

    const metrics = await getDashboardMetrics();
    expect(metrics.lowStockItems).toBe(4);
  });
});
