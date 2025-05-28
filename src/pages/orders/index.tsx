import PageHead from '@/components/shared/page-head';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import OrdersTable from './components';

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="Orders Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Orders', link: '/orders' }
        ]}
      />

      <OrdersTable />
    </div>
  );
}
