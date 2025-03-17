import PageHead from '@/components/shared/page-head';
import { useFetchCountries } from './hooks/useFetchCountries';
import CountriesTable from './components';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { useSearchParams } from 'react-router-dom';

export default function CountryPage() {
  // const [searchParams] = useSearchParams();
  // const { data, isLoading } = useFetchCountries();
  // const page = data?.data.pagination.current_page || 1;
  // const pageLimit = data?.data.pagination.per_page;
  // const country = searchParams.get('search') || null;
  // const offset = (page - 1) * pageLimit;
  // const countries = data?.data.items;
  // const totalCountries = data?.data.pagination.total; //1000
  // const pageCount = Math.ceil(totalCountries / pageLimit);

  return (
    <div className="p-4 md:p-8">
      <PageHead title="Country Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Countries', link: '/countries' }
        ]}
      />

      <CountriesTable
      // countries={countries}
      // page={page}
      // totalCountries={totalCountries}
      // pageCount={pageCount}
      />
    </div>
  );
}
