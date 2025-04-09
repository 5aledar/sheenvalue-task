import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  title?: string;
  icon?: string;
  renderModal: (onClose: () => void) => React.ReactNode;
};
export default function PopupModal({
  renderModal,
  title,
  icon
}: TPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Button
        className={icon == 'Edit' ? 'w-full p-2' : 'text-xs md:text-sm'}
        onClick={() => setIsOpen(true)}
        variant={icon == 'Edit' ? 'secondary' : 'default'}
      >
        {icon === 'Edit' ? (
          <Edit className="mr-1 w-4" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        {title || 'Add New'}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={'h-[80%] !bg-background !px-1'}
      >
        <ScrollArea className="h-[80%] px-6  ">
          {renderModal(onClose)}
        </ScrollArea>
      </Modal>
    </>
  );
}
