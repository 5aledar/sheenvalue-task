import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  variant:
    | 'link'
    | 'secondary'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | null
    | undefined;
  title?: string;
  icon?: string;
  renderModal: (onClose: () => void) => React.ReactNode;
};
export default function PopupModal({
  renderModal,
  title,
  variant,
  icon
}: TPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={variant}>
        {icon === 'Edit' ? (
          <Edit className="mr-1 w-4" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        {title}
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          form={true}
          className={' w-full !bg-background !px-1'}
        >
          {renderModal(onClose)}
        </Modal>
      )}
    </>
  );
}
