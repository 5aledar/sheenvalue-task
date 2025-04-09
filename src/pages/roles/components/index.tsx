import DataTable from '@/components/shared/data-table';
import { Role } from '../lib/types';
import { columns } from './table/columns';
import { useEffect, useState } from 'react';
import { useFetchRoles } from '../hooks/useFetchRoles';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import RoleTableActions from './table/city-table-action';

export default function RolesTable() {
  const [page, setPage] = useState(1);
  const {
    roles,
    pagination,
    isLoading
  }: { roles: Role[]; pagination: any; isLoading: boolean } =
    useFetchRoles(page);
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
          data={roles}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
