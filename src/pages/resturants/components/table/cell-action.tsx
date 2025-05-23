// import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
// import { useState } from 'react';
import { Resturant } from '../../lib/types';
import PopupModal from '@/components/shared/popup-modal';
import ResturantForm from '../forms/restaurant-form';
// import { useDeleteResturant } from '../../hooks/useDeleteResturant';
// import toast from 'react-hot-toast';

interface CellActionProps {
  data: Resturant;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const [open, setOpen] = useState(false);

  // const { mutate: deleteRole, isPending } = useDeleteResturant();

  // const onConfirm = async () => {
  //   deleteRole(data.id, {
  //     onSuccess: () => {
  //       toast.success('resturant deleted successfully');
  //       setOpen(false);
  //     },
  //     onError: (error) => {
  //       toast.error('something went wrong');
  //       console.log(error);
  //     }
  //   });
  // };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      /> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <div className="flex flex-col gap-2">
            <PopupModal
              title="update"
              icon="Edit"
              renderModal={(onClose) => (
                <ResturantForm modalClose={onClose} resturant={data} />
              )}
            />
            {/* <Button
              onClick={() => setOpen(true)}
              className="w-full p-2"
              variant={'secondary'}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button> */}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
