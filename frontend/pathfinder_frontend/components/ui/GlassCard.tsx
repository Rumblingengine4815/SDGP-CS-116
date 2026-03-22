import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ className, hover = false, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-content1/80 backdrop-blur-md border border-divider rounded-2xl',
        'shadow-[0_4px_24px_rgba(91,33,182,0.06)] dark:shadow-none',
        hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(91,33,182,0.12)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
