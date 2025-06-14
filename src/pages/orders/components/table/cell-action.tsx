import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash, Eye } from 'lucide-react';
import { useState } from 'react';
import { Order } from '../../lib/types';
import { useDeleteOrder } from '../../hooks/useDeleteOrder';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import OrderForm from '../forms/order-form';

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Get restaurant ID from the order data or localStorage as fallback
  const restaurantId =
    data.restaurant_id || localStorage.getItem('selected_restaurant_id') || '1';
  const deleteOrder = useDeleteOrder(restaurantId);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deleteOrder.mutateAsync(data.id);
      toast.success('Order deleted successfully');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <Modal
        title="Edit Order"
        description="Update order details"
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <OrderForm
          initialData={data}
          selectedRestaurantId={restaurantId}
          onSuccess={() => setEditModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Order Details"
        description="View order information"
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Order ID:</label>
              <p className="text-sm text-gray-600">{data.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Customer Phone:</label>
              <p className="text-sm text-gray-600">{data.customer_phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Price:</label>
              <p className="text-sm text-gray-600">
                ${data.price != null ? data.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Status:</label>
              <p className="text-sm text-gray-600">
                {data.status || 'pending'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Pickup Location:</label>
              <p className="text-sm text-gray-600">
                {data.pickup_latitude != null && data.pickup_longitude != null
                  ? `${data.pickup_latitude.toFixed(6)}, ${data.pickup_longitude.toFixed(6)}`
                  : 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Location:</label>
              <p className="text-sm text-gray-600">
                {data.delivery_latitude != null &&
                data.delivery_longitude != null
                  ? `${data.delivery_latitude.toFixed(6)}, ${data.delivery_longitude.toFixed(6)}`
                  : 'Not set'}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Notes:</label>
            <p className="text-sm text-gray-600">{data.notes || 'No notes'}</p>
          </div>
        </div>
      </Modal>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setViewModalOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
