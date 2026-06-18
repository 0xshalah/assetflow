import React from 'react';
import { render, screen } from '@testing-library/react';

// ─── Mock UI dependencies ────────────────────────────────────────────────────

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: React.PropsWithChildren<{ defaultValue?: string }>) => (
    <div data-testid='tabs' data-default={defaultValue}>
      {children}
    </div>
  ),
  TabsContent: ({ children, value }: React.PropsWithChildren<{ value?: string }>) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
  TabsList: ({ children }: React.PropsWithChildren) => (
    <div data-testid='tabs-list'>{children}</div>
  ),
  TabsTrigger: ({ children, value }: React.PropsWithChildren<{ value?: string }>) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  )
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
    onClick,
    ...props
  }: React.PropsWithChildren<{
    disabled?: boolean;
    onClick?: () => void;
    variant?: string;
    size?: string;
  }>) => (
    <button disabled={disabled} onClick={onClick} data-testid='download-btn'>
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: React.PropsWithChildren) => <table>{children}</table>,
  TableBody: ({ children }: React.PropsWithChildren) => <tbody>{children}</tbody>,
  TableCell: ({ children }: React.PropsWithChildren) => <td>{children}</td>,
  TableHead: ({ children }: React.PropsWithChildren) => <th>{children}</th>,
  TableHeader: ({ children }: React.PropsWithChildren) => <thead>{children}</thead>,
  TableRow: ({ children }: React.PropsWithChildren) => <tr>{children}</tr>
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
}));

import { PickupsTabs } from '@/features/pickups/components/pickups-tabs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface PickupRow {
  id: string;
  itemName: string;
  personName: string;
  originDepartment: string;
  releasedBy: string;
  releaseDepartment: string;
  quantity: number;
  purpose: string;
  pickedAt: Date;
}

function makePickup(overrides: Partial<PickupRow> = {}): PickupRow {
  return {
    id: 'p-1',
    itemName: 'Pulpen',
    personName: 'Budi',
    originDepartment: 'IT',
    releasedBy: 'Gindo Leonard M. Simanjuntak',
    releaseDepartment: 'FMD',
    quantity: 2,
    purpose: 'Meeting',
    pickedAt: new Date('2024-03-10T10:00:00Z'),
    ...overrides
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PickupsTabs', () => {
  it('renders all 3 tab triggers', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    expect(screen.getByTestId('tab-trigger-lemari-c01')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-lemari-c02')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-lemari-c03')).toBeInTheDocument();
  });

  it('shows count in tab trigger labels', () => {
    const c01 = [makePickup({ id: '1' }), makePickup({ id: '2' })];
    const c02 = [makePickup({ id: '3' })];
    render(<PickupsTabs lemariC01={c01} lemariC02={c02} lemariC03={[]} />);
    expect(screen.getByTestId('tab-trigger-lemari-c01').textContent).toContain('2');
    expect(screen.getByTestId('tab-trigger-lemari-c02').textContent).toContain('1');
    expect(screen.getByTestId('tab-trigger-lemari-c03').textContent).toContain('0');
  });

  it('renders tab content areas for each category', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    expect(screen.getByTestId('tab-content-lemari-c01')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-lemari-c02')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-lemari-c03')).toBeInTheDocument();
  });

  it('renders "Belum ada data" for empty categories', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    const emptyMessages = screen.getAllByText(/Belum ada data pengambilan/i);
    expect(emptyMessages.length).toBe(3);
  });

  it('renders download buttons (one per tab)', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    const buttons = screen.getAllByTestId('download-btn');
    expect(buttons.length).toBe(3);
  });

  it('disables download button when data is empty', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    const buttons = screen.getAllByTestId('download-btn');
    buttons.forEach((btn: HTMLElement) => {
      expect(btn).toBeDisabled();
    });
  });

  it('enables download button when data is present', () => {
    const pickups = [makePickup()];
    render(<PickupsTabs lemariC01={pickups} lemariC02={[]} lemariC03={[]} />);
    const buttons = screen.getAllByTestId('download-btn');
    // First button (Lemari C-01) should be enabled
    expect(buttons[0]).not.toBeDisabled();
    // Others still disabled
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });

  it('shows Download Excel text on buttons', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    const buttons = screen.getAllByText(/Download Excel/i);
    expect(buttons.length).toBe(3);
  });

  it('renders pickup data in table when provided', () => {
    const c01 = [makePickup({ itemName: 'Spidol Biru', personName: 'Andi' })];
    render(<PickupsTabs lemariC01={c01} lemariC02={[]} lemariC03={[]} />);
    expect(screen.getByText('Spidol Biru')).toBeInTheDocument();
    expect(screen.getByText('Andi')).toBeInTheDocument();
  });

  it('shows origin department and purpose in table', () => {
    const c02 = [makePickup({ originDepartment: 'Finance', purpose: 'Audit' })];
    render(<PickupsTabs lemariC01={[]} lemariC02={c02} lemariC03={[]} />);
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Audit')).toBeInTheDocument();
  });

  it('defaults to lemari-c01 tab', () => {
    render(<PickupsTabs lemariC01={[]} lemariC02={[]} lemariC03={[]} />);
    const tabs = screen.getByTestId('tabs');
    expect(tabs.getAttribute('data-default')).toBe('lemari-c01');
  });
});
