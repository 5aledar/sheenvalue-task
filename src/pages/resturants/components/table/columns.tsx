import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Resturant } from '../../lib/types';

export const columns: ColumnDef<Resturant>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logo = row.getValue('logo') as
        | { path: string; url: string }
        | string;

      // Handle both object and string logo formats
      let logoUrl = '';
      if (typeof logo === 'object' && logo?.url) {
        logoUrl = logo.url;
      } else if (typeof logo === 'string' && logo) {
        logoUrl = logo;
      }

      return logoUrl ? (
        <div className="flex w-24 items-center justify-center">
          <img
            src={logoUrl}
            alt="Restaurant logo"
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
            No Logo
          </div>
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'name_en',
    header: 'Name'
  },
  {
    accessorKey: 'address_en',
    header: 'Address'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'contact_number',
    header: 'Contact Number'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'start_time',
    header: 'Start Time'
  },
  {
    accessorKey: 'end_time',
    header: 'End Time'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
