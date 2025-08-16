import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Product } from '../../lib/types';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'thumbnail',
    header: 'Image',
    cell: ({ row }) => {
      const thumbnail = row.getValue('thumbnail') as string;
      return thumbnail ? (
        <div className="flex w-24 items-center justify-center">
          <img
            src={thumbnail}
            alt={row.original.title}
            className="h-12 w-12 rounded-md object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
          No Image
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `$${row.getValue('price')}`
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
