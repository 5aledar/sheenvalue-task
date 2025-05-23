import PageHead from '@/components/shared/page-head';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import ResturantsTable from './components';

export default function ResturantPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="Roles Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Resturants', link: '/resturants' }
        ]}
      />

      <ResturantsTable />
    </div>
  );
}
