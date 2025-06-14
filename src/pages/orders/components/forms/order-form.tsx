import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { useUpdateOrder } from '../../hooks/useUpdateOrder';
import { useFetchRestaurantsForSelect } from '../../hooks/useFetchRestaurantsForSelect';
import toast from 'react-hot-toast';
import { Order } from '../../lib/types';
import { useState, useEffect } from 'react';
import { LocationPicker } from '../../../resturants/components/LocationPicker';
import { MapPin, Phone, DollarSign, FileText } from 'lucide-react';

const orderFormSchema = z.object({
  pickup_latitude: z
    .number()
    .min(-90)
    .max(90, { message: 'Invalid pickup latitude' }),
  pickup_longitude: z
    .number()
    .min(-180)
    .max(180, { message: 'Invalid pickup longitude' }),
  delivery_latitude: z
    .number()
    .min(-90)
    .max(90, { message: 'Invalid delivery latitude' }),
  delivery_longitude: z
    .number()
    .min(-180)
    .max(180, { message: 'Invalid delivery longitude' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  notes: z.string().optional(),
  customer_phone: z.string().min(1, { message: 'Customer phone is required' })
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  initialData?: Order | null;
  selectedRestaurantId?: string;
  onSuccess?: () => void;
}

export default function OrderForm({
  initialData,
  selectedRestaurantId,
  onSuccess
}: OrderFormProps) {
  // Use the passed restaurant ID or get from localStorage as fallback
  const restaurantId =
    selectedRestaurantId || localStorage.getItem('restaurant_id') || '1';

  const createOrder = useCreateOrder(restaurantId);
  const updateOrder = useUpdateOrder(restaurantId);

  // Fetch restaurants to get the selected restaurant's location
  const { restaurants } = useFetchRestaurantsForSelect();

  // Find the selected restaurant
  const selectedRestaurant = restaurants?.find(
    (r: any) => r.id.toString() === restaurantId
  );

  const [deliveryCoords, setDeliveryCoords] = useState({
    lat: initialData?.delivery_latitude ?? 33.5138,
    lng: initialData?.delivery_longitude ?? 36.2765
  });

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: initialData
      ? {
          pickup_latitude:
            initialData.pickup_latitude ??
            (selectedRestaurant
              ? parseFloat(selectedRestaurant.latitude)
              : 33.5138),
          pickup_longitude:
            initialData.pickup_longitude ??
            (selectedRestaurant
              ? parseFloat(selectedRestaurant.longitude)
              : 36.2765),
          delivery_latitude: initialData.delivery_latitude ?? 33.5138,
          delivery_longitude: initialData.delivery_longitude ?? 36.2765,
          price: initialData.price ?? 0,
          notes: initialData.notes ?? '',
          customer_phone: initialData.customer_phone ?? ''
        }
      : {
          pickup_latitude: selectedRestaurant
            ? parseFloat(selectedRestaurant.latitude)
            : 33.5138,
          pickup_longitude: selectedRestaurant
            ? parseFloat(selectedRestaurant.longitude)
            : 36.2765,
          delivery_latitude: 33.5138,
          delivery_longitude: 36.2765,
          price: 0,
          notes: '',
          customer_phone: ''
        }
  });

  // Update pickup coordinates when restaurant changes
  useEffect(() => {
    if (selectedRestaurant && !initialData) {
      const restaurantLat = parseFloat(selectedRestaurant.latitude);
      const restaurantLng = parseFloat(selectedRestaurant.longitude);

      form.setValue('pickup_latitude', restaurantLat);
      form.setValue('pickup_longitude', restaurantLng);
    }
  }, [selectedRestaurant, form, initialData]);

  const isLoading = createOrder.isPending || updateOrder.isPending;

  const onSubmit = async (data: OrderFormValues) => {
    try {
      // Ensure notes is always a string
      const submitData = {
        ...data,
        notes: data.notes || ''
      };

      if (initialData) {
        await updateOrder.mutateAsync({
          orderId: initialData.id.toString(),
          data: submitData
        });
        toast.success('Order updated successfully');
      } else {
        await createOrder.mutateAsync(submitData);
        toast.success('Order created successfully');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeliveryLocationSelect = (lat: number, lng: number) => {
    setDeliveryCoords({ lat, lng });
    form.setValue('delivery_latitude', lat);
    form.setValue('delivery_longitude', lng);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <Heading
        title={initialData ? 'Update Order' : 'Create New Order'}
        description=""
        className="mb-4 text-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-4 w-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Customer Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter customer phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isLoading}
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Enter any notes for the order"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Delivery Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4" />
                Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-84">
                <LocationPicker
                  onLocationSelect={handleDeliveryLocationSelect}
                  initialLat={deliveryCoords.lat.toString()}
                  initialLng={deliveryCoords.lng.toString()}
                />
              </div>
            </CardContent>
          </Card>

          <Button disabled={isLoading} className="w-full" type="submit">
            {initialData ? 'Update Order' : 'Create Order'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
