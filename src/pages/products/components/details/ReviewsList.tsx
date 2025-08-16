import { Badge } from '@/components/ui/badge';
import { Product } from '../../lib/types';
import Review from './Review';

const ReviewsList = ({ data }: { data: Product }) => {
  return (
    <div className="mb-10 mt-5 rounded-xl bg-white p-5 shadow-lg">
      <div className="flex gap-3">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <Badge variant={'secondary'}>{data.reviews?.length}</Badge>
      </div>
      <div className="mt-10 flex flex-col justify-start gap-10">
        {data.reviews?.map((review) => <Review review={review} />)}
      </div>
    </div>
  );
};

export default ReviewsList;
