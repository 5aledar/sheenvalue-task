import PageHead from '@/components/shared/page-head';
import CountriesTable from './components';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function CityPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="City Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Cities', link: '/cities' }
        ]}
      />

      <CountriesTable />
    </div>
  );
}
