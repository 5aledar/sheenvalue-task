import { Button } from '@/components/ui/button';
import { IconLeft } from 'react-day-picker';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProduct } from './hooks/useFetchProduct';
import ImagesContainer from './components/details/ImagesContainer';
import Details from './components/details/Details';
import ReviewsList from './components/details/ReviewsList';
import Info from './components/details/Info';
import Ploicies from './components/details/Ploicies';
import ProductDetailsSkeleton from './components/details/ProductDetailsSkeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useFetchProduct(id!);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll bg-secondary p-10">
      <Button
        className="gap-3 bg-white p-5 text-black shadow-md hover:bg-secondary"
        onClick={() => navigate('/products')}
      >
        <IconLeft />
        Back to Products
      </Button>
      <div className="mt-16 flex flex-col justify-start gap-10 lg:flex-row">
        <div className="flex w-full flex-col  lg:w-[70%]">
          <ImagesContainer data={data} />
          <Details data={data} />
          <ReviewsList data={data} />
        </div>
        <div className="flex flex-col gap-8 md:w-[50%]">
          <Info data={data} />
          <Ploicies data={data} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
