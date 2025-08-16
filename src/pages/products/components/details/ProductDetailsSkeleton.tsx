import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { IconLeft } from 'react-day-picker';

const ProductDetailsSkeleton = () => {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll bg-secondary p-10">
      <Button
        className="gap-3 bg-white p-5 text-black shadow-md"
        variant={'default'}
        disabled
      >
        <IconLeft />
        Back to Products
      </Button>

      <div className="mt-16 flex flex-col justify-start gap-10 lg:flex-row">
        {/* Left column */}
        <div className="flex w-full flex-col gap-8 lg:w-[70%]">
          <Skeleton className="h-96 w-full rounded-xl" />{' '}
          {/* Big image skeleton */}
          <Skeleton className="h-80 w-full rounded-xl" />{' '}
          {/* Details + reviews */}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8 md:w-[50%]">
          <Skeleton className="h-48 w-full rounded-xl" /> {/* Info */}
          <Skeleton className="h-48 w-full rounded-xl" /> {/* Policies */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
