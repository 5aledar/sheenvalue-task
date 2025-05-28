import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import OrderForm from '../forms/order-form';

interface OrderTableActionsProps {
  selectedRestaurantId: string;
}

export default function OrderTableActions({
  selectedRestaurantId
}: OrderTableActionsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Modal
        title="Create New Order"
        description="Add a new order to the system"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <OrderForm
          selectedRestaurantId={selectedRestaurantId}
          onSuccess={() => setShowCreateModal(false)}
        />
      </Modal>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedRestaurantId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Order
          </Button>
        </div>
      </div>
    </>
  );
}
