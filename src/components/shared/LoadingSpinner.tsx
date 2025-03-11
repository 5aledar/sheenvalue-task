// components/shared/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-primary',
        sizes[size]
      )}
    />
  );
};

export default LoadingSpinner;
