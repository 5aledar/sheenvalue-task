import DataTable from '@/components/shared/data-table';

import { Area } from '../lib/types';
import { columns } from './table/columns';
import { useEffect, useState } from 'react';
import { useFetchAreas } from '../hooks/useFetchAreas';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import CityTableActions from './table/area-table-action';

export default function AreaTable() {
  const [page, setPage] = useState(1);
  const {
    areas,
    pagination,
    isLoading
  }: { areas: Area[]; pagination: any; isLoading: boolean } =
    useFetchAreas(page);
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
          data={areas}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
