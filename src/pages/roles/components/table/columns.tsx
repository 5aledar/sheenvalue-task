import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Role } from '../../lib/types';

export const columns: ColumnDef<Role>[] = [
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
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'name_en',
    header: 'Name (english)'
  },
  {
    accessorKey: 'name_ar',
    header: 'Name (arabic)'
  },
  {
    accessorKey: 'name_tr',
    header: 'Name (turkish)'
  },
  {
    accessorKey: 'guard',
    header: 'Guard'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} role={row.original} />
  }
];
