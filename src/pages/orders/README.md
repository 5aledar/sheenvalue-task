# Orders Management Module

This module provides complete CRUD functionality for managing restaurant orders.

## Features

- **Restaurant Selector**: Choose from available restaurants to view their orders
- **List Orders**: View all orders for a specific restaurant with pagination
- **Create Order**: Add new orders with pickup/delivery locations using interactive maps
- **Update Order**: Edit existing order details
- **Delete Order**: Remove orders from the system
- **View Details**: View complete order information in a modal
- **Persistent Selection**: Remember the last selected restaurant

## API Endpoints

The module integrates with the following API endpoints:

- `GET /restaurant/:restaurantId/orders` - Get all orders by restaurant ID
- `GET /restaurant/:restaurantId/orders/:orderId` - Get order details
- `POST /restaurant/:restaurantId/orders` - Store new order
- `PUT /restaurant/:restaurantId/orders/:orderId` - Update order

## Order Data Structure

```typescript
interface Order {
  id: number;
  restaurant_id: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  price: number;
  notes: string;
  customer_phone: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
```

## Components

### Main Components

- `OrdersPage` - Main page component with breadcrumbs
- `OrdersTable` - Data table with pagination and actions
- `OrderForm` - Form for creating/editing orders

### Table Components

- `columns.tsx` - Table column definitions
- `cell-action.tsx` - Row action buttons (view, edit, delete)
- `order-table-action.tsx` - Table header actions (add new order)

### Hooks

- `useFetchOrders` - Fetch orders with pagination
- `useFetchOrderDetails` - Fetch single order details
- `useFetchRestaurantsForSelect` - Fetch restaurants for dropdown selection
- `useCreateOrder` - Create new order
- `useUpdateOrder` - Update existing order
- `useDeleteOrder` - Delete order

## Map Integration

The module reuses the `LocationPicker` component from the restaurants module to:

- Select pickup coordinates on an interactive map
- Select delivery coordinates on an interactive map
- Display coordinates in latitude/longitude input fields
- Provide visual feedback for selected locations

## Navigation

The orders page is accessible via:

- Sidebar navigation: "Orders" menu item
- Direct URL: `/orders`
- Breadcrumb navigation from dashboard

## Styling

The module follows the existing design system:

- Uses shadcn/ui components
- Responsive design with mobile support
- Consistent with restaurant module styling
- Dark/light theme support

## Usage

1. Navigate to the Orders page from the sidebar
2. Select a restaurant from the dropdown selector
3. View existing orders for the selected restaurant in the data table
4. Click "Add New Order" to create a new order for the selected restaurant
5. Use the map to select pickup and delivery locations
6. Fill in customer phone, price, and notes
7. Submit the form to create the order
8. Use row actions to view, edit, or delete orders
9. Switch between restaurants using the selector to view different restaurant orders

## Dependencies

- React Hook Form with Zod validation
- TanStack Query for data fetching
- Leaflet for map functionality
- React Router for navigation
- React Hot Toast for notifications
