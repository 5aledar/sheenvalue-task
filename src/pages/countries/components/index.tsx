import DataTable from '@/components/shared/data-table';

import CountryTableActions from './table/country-table-action';
import { Country } from '../lib/types';
import { columns } from './table/columns';

type TCountryTableProps = {
  countries: Country[];
  page: number;
  totalCountries?: number;
  pageCount?: number;
};

export default function CountriesTable({
  countries,
  pageCount,
  totalCountries
}: TCountryTableProps) {
  return (
    <>
      <CountryTableActions />
      {countries && (
        <DataTable columns={columns} data={countries} pageCount={pageCount} />
      )}
    </>
  );
}
