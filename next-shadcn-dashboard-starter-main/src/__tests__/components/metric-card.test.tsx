import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Card UI component
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid='card' {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid='card-content' {...props}>
      {children}
    </div>
  )
}));

import { MetricCard } from '@/features/overview/components/metric-card';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title='Total Items' value={42} />);
    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<MetricCard title='Active' value={10} description='Last 30 days' />);
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<MetricCard title='Count' value={5} />);
    expect(screen.queryByText('Last 30 days')).not.toBeInTheDocument();
  });

  it('renders zero value correctly', () => {
    render(<MetricCard title='Empty' value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders large numbers', () => {
    render(<MetricCard title='Big' value={999999} />);
    expect(screen.getByText('999999')).toBeInTheDocument();
  });
});
