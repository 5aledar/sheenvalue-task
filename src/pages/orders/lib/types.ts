export interface Order {
  id: number;
  restaurant_id: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_latitude?: number;
  delivery_longitude?: number;
  price?: number;
  notes?: string;
  customer_phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderFormData {
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  price: number;
  notes: string;
  customer_phone: string;
}
