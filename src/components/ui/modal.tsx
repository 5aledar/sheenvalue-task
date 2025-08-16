'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  form?: boolean;
}
import { TriangleAlert } from 'lucide-react';
export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  form,
  className
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        className={`${className || ''} !w-[80%] ${form ? 'max-w-[1000px]' : 'max-w-[500px]'}`}
      >
        <DialogHeader>
          {title && (
            <DialogTitle>
              <div className="flex items-center gap-2">
                <TriangleAlert className="text-red-500" />
                {title}
              </div>
            </DialogTitle>
          )}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
