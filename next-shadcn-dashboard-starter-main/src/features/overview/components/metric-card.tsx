import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number;
  description?: string;
}

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card className='border-zinc-100 dark:border-zinc-800/50'>
      <CardContent className='p-6'>
        <p className='text-muted-foreground text-[13px] font-medium'>{title}</p>
        <p
          className='mt-2 text-3xl font-semibold tabular-nums'
          style={{ letterSpacing: '-0.03em' }}
        >
          {value}
        </p>
        {description && <p className='text-muted-foreground mt-1 text-[12px]'>{description}</p>}
      </CardContent>
    </Card>
  );
}
