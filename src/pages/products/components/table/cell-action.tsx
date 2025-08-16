// import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';

import { Eye, Trash } from 'lucide-react';
import { Product } from '../../lib/types';
import PopupModal from '@/components/shared/popup-modal';
import ProductForm from '../forms/product-form';
import { useState } from 'react';
import { AlertModal } from '@/components/shared/alert-modal';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const onConfirm = async () => {
    deleteProduct(data.id, {
      onSuccess: () => {
        toast.success('product deleted successfully');
        setOpen(false);
      },
      onError: (error) => {
        toast.error('something went wrong');
        console.log(error);
      }
    });
  };
  const navigate = useNavigate();
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
        brand={data?.brand}
        productName={data?.title}
      />
      <div className="flex justify-start ">
        <Button
          onClick={() => navigate(`/products/${data.id}`)}
          className=""
          variant="ghost"
        >
          <Eye className=" h-4 w-4 " />
        </Button>
        <PopupModal
          title=""
          icon="Edit"
          variant="ghost"
          renderModal={(onClose) => (
            <ProductForm modalClose={onClose} product={data} />
          )}
        />
        <Button onClick={() => setOpen(true)} variant={'ghost'}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </>
  );
};
