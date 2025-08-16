import { Badge } from '@/components/ui/badge';
import { Product } from '../../lib/types';
import { Package, Star } from 'lucide-react';

const Details = ({ data }: { data: Product }) => {
  return (
    <div className="details mt-5 rounded-xl bg-white p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold ">{data.title}</h2>
          <div className="flex gap-1 text-slate-500">
            {data?.tags!.map((tag: string, index: number) => (
              <p key={index}>
                {tag}
                {index + 1 !== data.tags!.length && ' · '}
              </p>
            ))}
          </div>
        </div>
        <Badge variant={'secondary'}>{data?.availabilityStatus}</Badge>
      </div>
      <div className="fllex mt-5 flex-col space-y-3">
        <h1 className="text-2xl font-bold text-orange-600">${data.price}</h1>
        <div className="flex flex-col items-start justify-start gap-3  space-x-3 md:flex-row md:items-center">
          <div className="flex items-center justify-start gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={20}
                className={
                  index < Math.floor(data?.rating!)
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-slate-400">
            {data.rating} ({data.reviews?.length} reviews)
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <Package size={18} />
            {data.stock} in stock
          </p>
        </div>
        <hr />
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold">Description </h2>
          <p className="text-slate-500">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
