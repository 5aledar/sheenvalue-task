import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Order } from '../../lib/types';

export const columns: ColumnDef<Order>[] = [
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
    header: 'Order ID'
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return `$${price != null ? price.toFixed(2) : '0.00'}`;
    }
  },
  {
    accessorKey: 'pickup_latitude',
    header: 'Pickup Location',
    cell: ({ row }) => {
      const pickupLat = row.getValue('pickup_latitude') as number;
      const pickupLng = row.original.pickup_longitude;
      return pickupLat != null && pickupLng != null
        ? `${pickupLat.toFixed(4)}, ${pickupLng.toFixed(4)}`
        : 'Not set';
    }
  },
  {
    accessorKey: 'delivery_latitude',
    header: 'Delivery Location',
    cell: ({ row }) => {
      const deliveryLat = row.getValue('delivery_latitude') as number;
      const deliveryLng = row.original.delivery_longitude;
      return deliveryLat != null && deliveryLng != null
        ? `${deliveryLat.toFixed(4)}, ${deliveryLng.toFixed(4)}`
        : 'Not set';
    }
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string;
      return notes ? (
        <div className="max-w-32 truncate" title={notes}>
          {notes}
        </div>
      ) : (
        <span className="text-gray-400">No notes</span>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            status === 'completed'
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status || 'pending'}
        </span>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return createdAt ? new Date(createdAt).toLocaleDateString() : '-';
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
