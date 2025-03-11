import PageHead from '@/components/shared/page-head';
import { useFetchCountries } from './hooks/useFetchCountries';
import CountriesTable from './components';
// import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
// import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function CountryPage() {
  const { data, isLoading } = useFetchCountries();
  // const [searchParams] = useSearchParams();
  const page = data?.data.pagination.current_page || 1;
  const pageLimit = data?.data.pagination.per_page;
  // const country = searchParams.get('search') || null;
  // const offset = (page - 1) * pageLimit;
  const countries = data?.data.items;
  const totalCountries = data?.data.pagination.total; //1000
  const pageCount = Math.ceil(totalCountries / pageLimit);

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton columnCount={3} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHead title="Country Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Countries', link: '/countries' }
        ]}
      />
      {!isLoading && (
        <CountriesTable
          countries={countries}
          page={page}
          totalCountries={totalCountries}
          pageCount={pageCount}
        />
      )}
    </div>
  );
}
