import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { Country } from '../../lib/types';
import PopupModal from '@/components/shared/popup-modal';
import CountryForm from '../forms/country-form';
import { useDeleteCountry } from '../../hooks/useDeleteCountry';
import toast from 'react-hot-toast';

interface CountryCellActionProps {
  data: Country;
  country: Country;
}

export const CellAction: React.FC<CountryCellActionProps> = ({
  data,
  country
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteCountry, isPending } = useDeleteCountry();

  const onConfirm = async () => {
    deleteCountry(data.id, {
      onSuccess: () => {
        toast.success('Country deleted successfully');
        setOpen(false);
      },
      onError: (error) => {
        toast.error('Something went wrong');
        console.error(error);
      }
    });
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />

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
              title="Update"
              icon="Edit"
              renderModal={(onClose) => (
                <CountryForm modalClose={onClose} country={data} />
              )}
            />
            <Button
              onClick={() => setOpen(true)}
              className="w-full p-2"
              variant={'secondary'}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
