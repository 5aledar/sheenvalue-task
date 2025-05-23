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
