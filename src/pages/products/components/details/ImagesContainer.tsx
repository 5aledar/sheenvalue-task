import { useEffect, useState } from 'react';
import { Product } from '../../lib/types';

const ImagesContainer = ({ data }: { data: Product }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // when product data loads, set default image
  useEffect(() => {
    if (data?.thumbnail) {
      setSelectedImage(data.thumbnail);
    }
  }, [data]);
  return (
    <div className="images flex flex-col items-center justify-center gap-5 rounded-xl bg-white p-5 shadow-md ">
      <img
        src={selectedImage ?? data.thumbnail}
        width={400}
        className="bg-secondary"
      />
      <div className="flex items-center justify-center gap-2">
        {data?.images!.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            width={50}
            alt={`${image}-${index + 1}`}
            className={`border-1 cursor-pointer rounded-md border transition-all hover:scale-110 ${
              selectedImage === image ? 'ring-2 ring-black' : ''
            }`}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagesContainer;
