import DataTable from '@/components/shared/data-table';
import { Order } from '../lib/types';
import { columns } from './table/columns';
import { useEffect, useState } from 'react';
import { useFetchOrders } from '../hooks/useFetchOrders';
import { useFetchRestaurantsForSelect } from '../hooks/useFetchRestaurantsForSelect';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import OrderTableActions from './table/order-table-action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersTable() {
  const [page, setPage] = useState(1);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');

  // Fetch restaurants for the select dropdown
  const { restaurants, isLoading: isLoadingRestaurants } =
    useFetchRestaurantsForSelect();

  // Set default restaurant when restaurants are loaded
  useEffect(() => {
    if (restaurants && restaurants.length > 0 && !selectedRestaurantId) {
      const savedRestaurantId = localStorage.getItem('selected_restaurant_id');
      if (
        savedRestaurantId &&
        restaurants.find((r: any) => r.id.toString() === savedRestaurantId)
      ) {
        setSelectedRestaurantId(savedRestaurantId);
      } else {
        setSelectedRestaurantId(restaurants[0].id.toString());
      }
    }
  }, [restaurants, selectedRestaurantId]);

  const {
    orders,
    pagination,
    isLoading
  }: { orders: Order[]; pagination: any; isLoading: boolean } = useFetchOrders(
    selectedRestaurantId,
    page
  );

  useEffect(() => {
    if (!isLoading) {
      setPage(pagination?.page);
    }
  }, [pagination?.page, isLoading]);

  const pageLimit = pagination?.per_page;
  const totalOrders = pagination?.total;
  const pageCount = Math.ceil(totalOrders! / pageLimit);

  const handleRestaurantChange = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setPage(1); // Reset to first page when changing restaurant
    localStorage.setItem('selected_restaurant_id', restaurantId);
  };

  const selectedRestaurant = restaurants?.find(
    (r: any) => r.id.toString() === selectedRestaurantId
  );

  return (
    <>
      {/* Restaurant Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedRestaurantId}
            onValueChange={handleRestaurantChange}
            disabled={isLoadingRestaurants}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants?.map((restaurant: any) => (
                <SelectItem
                  key={restaurant.id}
                  value={restaurant.id.toString()}
                >
                  <div className="flex items-center space-x-2">
                    {restaurant.logo &&
                    typeof restaurant.logo === 'object' &&
                    restaurant.logo.url ? (
                      <img
                        src={restaurant.logo.url}
                        alt={restaurant.name_en}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                    )}
                    <span>{restaurant.name_en}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRestaurant && (
            <div className="mt-2 text-sm text-gray-600">
              Selected:{' '}
              <span className="font-medium">{selectedRestaurant.name_en}</span>
              {selectedRestaurant.address_en && (
                <span className="ml-2">• {selectedRestaurant.address_en}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderTableActions selectedRestaurantId={selectedRestaurantId} />

      {!selectedRestaurantId && !isLoadingRestaurants ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No Restaurant Selected
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Please select a restaurant from the dropdown above to view orders.
            </p>
          </div>
        </div>
      ) : isLoading || !selectedRestaurantId ? (
        <div className="p-5">
          <DataTableSkeleton columnCount={9} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders || []}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
