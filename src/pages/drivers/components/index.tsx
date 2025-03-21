import DataTable from '@/components/shared/data-table';

import CountryTableActions from './table/driver-table-action';
import { Area, City, Driver } from '../lib/types';
import { columns } from './table/columns';
import { useEffect, useState } from 'react';
import { useFetchDrivers } from '../hooks/useFetchDrivers';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import CityTableActions from './table/driver-table-action';

export default function AreaTable() {
  const [page, setPage] = useState(1);
  const {
    drivers,
    pagination,
    isLoading
  }: { drivers: Driver[]; pagination: any; isLoading: boolean } =
    useFetchDrivers(page);
  useEffect(() => {
    if (!isLoading) {
      setPage(pagination?.page);
    }
  }, [pagination?.page, isLoading]);

  const pageLimit = pagination?.per_page;
  const totalCountries = pagination?.total;
  const pageCount = Math.ceil(totalCountries! / pageLimit);

  return (
    <>
      <CityTableActions />
      {isLoading ? (
        <div className="p-5">
          <DataTableSkeleton columnCount={3} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={drivers}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
