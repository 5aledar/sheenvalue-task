import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Driver } from '../../lib/types';

export const columns: ColumnDef<Driver>[] = [
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
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name'
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'vehicle_type',
    header: 'Vehicle Type'
  },
  {
    accessorKey: 'plate_number',
    header: 'Plate Number'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`rounded-full px-2 py-1 text-white ${
          row.original.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {row.original.status === 'ACTIVE' ? 'Active' : 'Inactive'}
      </span>
    )
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => row.original.city?.name_en || 'N/A'
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => row.original.area?.name_en || 'N/A'
  },
  {
    accessorKey: 'is_available',
    header: 'Availability',
    cell: ({ row }) =>
      row.original.is_available ? (
        <span className="text-green-500">Available</span>
      ) : (
        <span className="text-red-500">Unavailable</span>
      )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} driver={row.original} />
  }
];
