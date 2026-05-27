import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

jest.mock('@/features/inventory/actions', () => ({
  createItem: jest.fn().mockResolvedValue({ success: true, message: 'OK' })
}));

// Mock Sheet components as simple pass-throughs
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode; open?: boolean }) => (
    <div data-testid='sheet'>{children}</div>
  ),
  SheetTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid='sheet-trigger'>{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='sheet-content'>{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  SheetFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) => (
    <label {...props}>{children}</label>
  )
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, name }: { children: React.ReactNode; name?: string }) => (
    <div data-testid={`select-${name}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  )
}));

jest.mock('@/components/icons', () => ({
  Icons: {
    add: (props: React.SVGAttributes<SVGElement>) => <svg data-testid='icon-add' {...props} />,
    spinner: (props: React.SVGAttributes<SVGElement>) => (
      <svg data-testid='icon-spinner' {...props} />
    )
  }
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import { AddItemSheet } from '@/features/inventory/components/add-item-sheet';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AddItemSheet', () => {
  it('renders the "Barang Masuk" trigger button', () => {
    render(<AddItemSheet />);
    expect(screen.getByText('Barang Masuk')).toBeTruthy();
  });

  it('renders the sheet title', () => {
    render(<AddItemSheet />);
    expect(screen.getByText('Input Barang Masuk')).toBeTruthy();
  });

  it('renders the sheet description', () => {
    render(<AddItemSheet />);
    expect(screen.getByText('Catat barang baru yang masuk ke inventory.')).toBeTruthy();
  });

  it('renders all required form labels', () => {
    render(<AddItemSheet />);
    const labels = [
      'Nama Barang',
      'Spesifikasi',
      'Kategori Barang',
      'Jumlah Barang Masuk (Qty)',
      'Unit',
      'Supplier',
      'Tanggal Barang Masuk',
      'Waktu Barang Masuk'
    ];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  it('renders name input field', () => {
    render(<AddItemSheet />);
    const nameInput = screen.getByPlaceholderText('Nama barang');
    expect(nameInput).toBeTruthy();
    expect(nameInput.getAttribute('name')).toBe('name');
  });

  it('renders specification input field', () => {
    render(<AddItemSheet />);
    const specInput = screen.getByPlaceholderText('Spesifikasi barang (opsional)');
    expect(specInput).toBeTruthy();
    expect(specInput.getAttribute('name')).toBe('specification');
  });

  it('renders category select with 3 options', () => {
    render(<AddItemSheet />);
    expect(screen.getByText('Lemari C-01')).toBeTruthy();
    expect(screen.getByText('Lemari C-02')).toBeTruthy();
    expect(screen.getByText('Lemari C-03')).toBeTruthy();
  });

  it('renders quantity input with type=number and min=1', () => {
    render(<AddItemSheet />);
    const qtyInput = screen.getByPlaceholderText('10');
    expect(qtyInput).toBeTruthy();
    expect(qtyInput.getAttribute('type')).toBe('number');
    expect(qtyInput.getAttribute('min')).toBe('1');
  });

  it('renders unit input field', () => {
    render(<AddItemSheet />);
    const unitInput = screen.getByPlaceholderText('pcs, box, meter, dll.');
    expect(unitInput).toBeTruthy();
    expect(unitInput.getAttribute('name')).toBe('unit');
  });

  it('renders supplier input field', () => {
    render(<AddItemSheet />);
    const supplierInput = screen.getByPlaceholderText('PT. Sumber Jaya');
    expect(supplierInput).toBeTruthy();
    expect(supplierInput.getAttribute('name')).toBe('supplier');
  });

  it('renders date input with type=date', () => {
    render(<AddItemSheet />);
    const dateInput = screen.getByDisplayValue(new Date().toISOString().split('T')[0]);
    expect(dateInput).toBeTruthy();
    expect(dateInput.getAttribute('type')).toBe('date');
    expect(dateInput.getAttribute('name')).toBe('receivedDate');
  });

  it('renders time input with type=time', () => {
    render(<AddItemSheet />);
    const inputs = document.querySelectorAll('input[type="time"]');
    expect(inputs.length).toBe(1);
    expect(inputs[0].getAttribute('name')).toBe('receivedTime');
  });

  it('renders Simpan submit button', () => {
    render(<AddItemSheet />);
    expect(screen.getByText('Simpan')).toBeTruthy();
  });

  it('submit button has type=submit', () => {
    render(<AddItemSheet />);
    const btn = screen.getByText('Simpan');
    expect(btn.getAttribute('type')).toBe('submit');
  });
});
