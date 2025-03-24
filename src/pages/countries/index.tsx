import PageHead from '@/components/shared/page-head';
import CountriesTable from './components';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function CountryPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="Country Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Countries', link: '/countries' }
        ]}
      />

      <CountriesTable />
    </div>
  );
}
