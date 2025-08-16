import { Star } from 'lucide-react';

const Review = ({ review }) => {
  return (
    <div className="flex items-start gap-4">
      <img
        src={`https://ui-avatars.com/api?rounded=true&background=F35B27&name=${review.reviewerName}&color=fff`}
        width={42}
      />
      <div className="flex flex-col justify-start">
        <h2 className="text-sm font-semibold">{review.reviewerName}</h2>
        <div className="flex items-center justify-start gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < Math.floor(review?.rating!)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-300'
              }
            />
          ))}
          <p className="text-sm text-slate-400">
            {new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-500">{review.comment}</p>
      </div>
      <hr />
    </div>
  );
};

export default Review;
