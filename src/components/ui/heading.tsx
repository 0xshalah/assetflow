import { InfoButton } from '@/components/ui/info-button';
import type { InfobarContent } from '@/components/ui/infobar';

interface HeadingProps {
  title: string;
  description: string;
  infoContent?: InfobarContent;
}

export function Heading({ title, description, infoContent }: HeadingProps) {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <h2
          className='text-2xl font-semibold tracking-tight md:text-3xl'
          style={{ letterSpacing: '-0.025em' }}
        >
          {title}
        </h2>
        {infoContent && (
          <div className='pt-1'>
            <InfoButton content={infoContent} />
          </div>
        )}
      </div>
      <p className='text-muted-foreground mt-1 text-[15px]'>{description}</p>
    </div>
  );
}
