import DataTable from '@/components/shared/data-table';
import { columns } from './table/columns';
import { useState } from 'react';
import { useFetchProducts } from '../hooks/useFetchProducts';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import RoleTableActions from './table/product-table-action';

export default function ProductsTable() {
  const [page, setPage] = useState(1);

  const { products, pagination, isLoading } = useFetchProducts(page);

  // Compute pageCount safely
  const pageLimit = pagination?.limit || 10; // fallback if API doesn't provide
  const totalItems = pagination?.total || 0;
  const pageCount = Math.ceil(totalItems / pageLimit);

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
          data={products || []} // fallback to empty array
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
