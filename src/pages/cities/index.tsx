import PageHead from '@/components/shared/page-head';
import { useFetchCities } from './hooks/useFetchCities';
import CountriesTable from './components';
// import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
// import LoadingSpinner from '@/components/shared/LoadingSpinner';

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
