import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard/pickups',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() })
}));

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
    onClick
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

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: React.PropsWithChildren) => <nav>{children}</nav>,
  PaginationContent: ({ children }: React.PropsWithChildren) => <ul>{children}</ul>,
  PaginationItem: ({ children }: React.PropsWithChildren) => <li>{children}</li>,
  PaginationLink: ({
    children,
    href
  }: React.PropsWithChildren<{ href?: string; isActive?: boolean }>) => (
    <a href={href}>{children}</a>
  ),
  PaginationPrevious: ({ children, href }: React.PropsWithChildren<{ href?: string }>) => (
    <a href={href}>{children}</a>
  ),
  PaginationNext: ({ children, href }: React.PropsWithChildren<{ href?: string }>) => (
    <a href={href}>{children}</a>
  )
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

interface PickupRow {
  id: string;
  itemName: string;
  itemSpecification: string;
  personName: string;
  departmentOrigin: string;
  quantity: number;
  purpose: string;
  issuedBy: string;
  issuerDepartment: string;
  pickedAt: Date;
}

function makePickup(overrides: Partial<PickupRow> = {}): PickupRow {
  return {
    id: 'p-1',
    itemName: 'Pulpen',
    itemSpecification: 'Gel ink',
    personName: 'Budi',
    departmentOrigin: 'IT',
    quantity: 2,
    purpose: 'Meeting',
    issuedBy: 'Gindo Leonard M. Simanjuntak',
    issuerDepartment: 'FMD',
    pickedAt: new Date('2024-03-10T10:00:00Z'),
    ...overrides
  };
}

const defaultProps = {
  totalC01: 0,
  totalC02: 0,
  totalC03: 0,
  pageC01: 1,
  pageC02: 1,
  pageC03: 1,
  itemsPerPage: 15
};

describe('PickupsTabs', () => {
  it('renders all 3 tab triggers', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    expect(screen.getByTestId('tab-trigger-lemari-c01')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-lemari-c02')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-lemari-c03')).toBeInTheDocument();
  });

  it('shows count in tab trigger labels', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
        totalC01={5}
        totalC02={3}
        totalC03={0}
      />
    );
    expect(screen.getByTestId('tab-trigger-lemari-c01').textContent).toContain('5');
    expect(screen.getByTestId('tab-trigger-lemari-c02').textContent).toContain('3');
    expect(screen.getByTestId('tab-trigger-lemari-c03').textContent).toContain('0');
  });

  it('renders tab content areas for each category', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    expect(screen.getByTestId('tab-content-lemari-c01')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-lemari-c02')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-lemari-c03')).toBeInTheDocument();
  });

  it('renders "Belum ada data" for empty categories', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    const emptyMessages = screen.getAllByText(/Belum ada data/i);
    expect(emptyMessages.length).toBe(3);
  });

  it('renders download buttons (one per tab)', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    const buttons = screen.getAllByTestId('download-btn');
    expect(buttons.length).toBe(3);
  });

  it('disables download button when data is empty', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    const buttons = screen.getAllByTestId('download-btn');
    buttons.forEach((btn: HTMLElement) => {
      expect(btn).toBeDisabled();
    });
  });

  it('enables download button when data is present', () => {
    render(
      <PickupsTabs
        lemariC01={[makePickup()]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
        totalC01={1}
      />
    );
    const buttons = screen.getAllByTestId('download-btn');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });

  it('shows Download Excel text on buttons', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    const buttons = screen.getAllByText(/Download Excel/i);
    expect(buttons.length).toBe(3);
  });

  it('renders pickup data in table when provided', () => {
    render(
      <PickupsTabs
        lemariC01={[makePickup({ itemName: 'Spidol Biru', personName: 'Andi' })]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
        totalC01={1}
      />
    );
    expect(screen.getByText('Spidol Biru')).toBeInTheDocument();
    expect(screen.getByText('Andi')).toBeInTheDocument();
  });

  it('shows origin department and purpose in table', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[makePickup({ departmentOrigin: 'Finance', purpose: 'Audit' })]}
        lemariC03={[]}
        {...defaultProps}
        totalC02={1}
      />
    );
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Audit')).toBeInTheDocument();
  });

  it('defaults to lemari-c01 tab', () => {
    render(
      <PickupsTabs
        lemariC01={[]}
        lemariC02={[]}
        lemariC03={[]}
        {...defaultProps}
      />
    );
    const tabs = screen.getByTestId('tabs');
    expect(tabs.getAttribute('data-default')).toBe('lemari-c01');
  });
});
