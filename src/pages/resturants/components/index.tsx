import DataTable from '@/components/shared/data-table';
import { Resturant } from '../lib/types';
import { columns } from './table/columns';
import { useEffect, useState } from 'react';
import { useFetchResturants } from '../hooks/useFetchResturants';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import RoleTableActions from './table/city-table-action';

export default function ResturantsTable() {
  const [page, setPage] = useState(1);
  const {
    resturants,
    pagination,
    isLoading
  }: { resturants: Resturant[]; pagination: any; isLoading: boolean } =
    useFetchResturants(page);
  useEffect(() => {
    if (!isLoading) {
      setPage(pagination?.page);
    }
  }, [pagination?.page, isLoading]);

  const pageLimit = pagination?.per_page;
  const totalRoles = pagination?.total;
  const pageCount = Math.ceil(totalRoles! / pageLimit);

  return (
    <>
      <RoleTableActions />
      {isLoading ? (
        <div className="p-5">
          <DataTableSkeleton columnCount={3} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={resturants}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
