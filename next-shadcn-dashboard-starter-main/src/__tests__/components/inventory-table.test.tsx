import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Item } from '@/db/schema/items';

// ─── Mock UI dependencies ────────────────────────────────────────────────────

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: React.PropsWithChildren) => <span data-testid='badge'>{children}</span>
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
    onClick
  }: React.PropsWithChildren<{ disabled?: boolean; onClick?: () => void }>) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid='dropdown-content'>{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <div data-testid='dropdown-item' onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children }: React.PropsWithChildren) => <div>{children}</div>
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: React.PropsWithChildren) => <table>{children}</table>,
  TableBody: ({ children }: React.PropsWithChildren) => <tbody>{children}</tbody>,
  TableCell: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <td className={className}>{children}</td>
  ),
  TableHead: ({ children }: React.PropsWithChildren) => <th>{children}</th>,
  TableHeader: ({ children }: React.PropsWithChildren) => <thead>{children}</thead>,
  TableRow: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <tr className={className}>{children}</tr>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({
    value,
    onChange,
    placeholder
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} />
}));

jest.mock('@/components/icons', () => ({
  Icons: {
    ellipsis: () => <span>...</span>,
    trash: () => <span>🗑</span>,
    edit: () => <span>✏</span>,
    search: () => <span>🔍</span>
  }
}));

// Use @/ alias so Jest resolves it the same way as the component under test
jest.mock('@/features/inventory/actions', () => ({
  deleteItem: jest.fn().mockResolvedValue({ success: true, message: 'Berhasil' })
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}));

// ─── Component import (after mocks) ─────────────────────────────────────────

import { InventoryTable } from '@/features/inventory/components/inventory-table';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    name: 'Pulpen Hitam',
    specification: 'Gel ink',
    category: 'lemari-c01',
    quantity: 20,
    unit: 'pcs',
    supplier: 'Toko ATK',
    minimumStock: 5,
    receivedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    ...overrides
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('InventoryTable', () => {
  it('shows empty state message when data is empty', () => {
    render(<InventoryTable data={[]} />);
    expect(screen.getByText(/Belum ada barang/i)).toBeInTheDocument();
  });

  it('renders item names in the table', () => {
    const items = [
      makeItem({ name: 'Spidol Merah' }),
      makeItem({ id: 'item-2', name: 'Penggaris' })
    ];
    render(<InventoryTable data={items} />);
    expect(screen.getByText('Spidol Merah')).toBeInTheDocument();
    expect(screen.getByText('Penggaris')).toBeInTheDocument();
  });

  it('displays category label for lemari-c01', () => {
    render(<InventoryTable data={[makeItem({ category: 'lemari-c01' })]} />);
    expect(screen.getByText('Lemari C-01')).toBeInTheDocument();
  });

  it('displays category label for lemari-c02', () => {
    render(<InventoryTable data={[makeItem({ category: 'lemari-c02' })]} />);
    expect(screen.getByText('Lemari C-02')).toBeInTheDocument();
  });

  it('displays category label for lemari-c03', () => {
    render(<InventoryTable data={[makeItem({ category: 'lemari-c03' })]} />);
    expect(screen.getByText('Lemari C-03')).toBeInTheDocument();
  });

  it('applies yellow background class to low stock item (quantity <= minimumStock, > 0)', () => {
    const { container } = render(
      <InventoryTable data={[makeItem({ quantity: 6, minimumStock: 10 })]} />
    );
    const rows = Array.from(container.querySelectorAll('tr')) as HTMLElement[];
    const dataRow = rows.find(
      (tr) => tr.className.includes('bg-yellow') || tr.className.includes('yellow')
    );
    expect(dataRow).toBeTruthy();
  });

  it('does NOT apply yellow background to normal stock item (quantity >= 7)', () => {
    const { container } = render(<InventoryTable data={[makeItem({ quantity: 7 })]} />);
    const rows = Array.from(container.querySelectorAll('tr')) as HTMLElement[];
    const yellowRow = rows.find(
      (tr) => tr.className.includes('bg-yellow') || tr.className.includes('yellow')
    );
    expect(yellowRow).toBeFalsy();
  });

  it('does NOT apply yellow background to out-of-stock item (quantity = 0)', () => {
    const { container } = render(<InventoryTable data={[makeItem({ quantity: 0 })]} />);
    const rows = Array.from(container.querySelectorAll('tr')) as HTMLElement[];
    const yellowRow = rows.find(
      (tr) => tr.className.includes('bg-yellow') || tr.className.includes('yellow')
    );
    expect(yellowRow).toBeFalsy();
  });

  it('shows supplier name', () => {
    render(<InventoryTable data={[makeItem({ supplier: 'UD Sejahtera' })]} />);
    expect(screen.getByText('UD Sejahtera')).toBeInTheDocument();
  });

  it('shows specification or dash when empty', () => {
    render(<InventoryTable data={[makeItem({ specification: '' })]} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('shows unit or dash when empty', () => {
    render(<InventoryTable data={[makeItem({ unit: '' })]} />);
    // specification is also empty so there will be multiple '-'
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct quantity value', () => {
    render(<InventoryTable data={[makeItem({ quantity: 42 })]} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders multiple items correctly', () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeItem({ id: `item-${i}`, name: `Barang ${i}`, quantity: i + 1 })
    );
    render(<InventoryTable data={items} />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Barang ${i}`)).toBeInTheDocument();
    }
  });
});
