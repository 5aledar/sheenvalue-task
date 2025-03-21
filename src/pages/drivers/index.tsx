import PageHead from '@/components/shared/page-head';
import AreaTable from './components';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function DriverPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="City Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Areas', link: '/areas' }
        ]}
      />
      <AreaTable />
    </div>
  );
}
