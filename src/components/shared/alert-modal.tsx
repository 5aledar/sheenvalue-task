import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TriangleAlert } from 'lucide-react';

type TAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  brand?: string;
  description?: string;
  productName: string;
};
export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  brand,
  productName,
  title = 'Are you sure?',
  description = 'This action cannot be undone. The product will be permanently removed from your inventoory.'
}: TAlertModalProps) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-start gap-3 text-wrap rounded-xl border-2 border-solid border-red-300 p-4 text-red-500">
        <TriangleAlert />
        <p>
          Are you sure you want to delete{' '}
          <span className="font-bold">{productName}</span> by{' '}
          <span className="font-bold">{brand!} </span>
        </p>
      </div>
      <div className="flex  items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Delete Product
        </Button>
      </div>
    </Modal>
  );
};
