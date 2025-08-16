import React, { useCallback } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchProducts } from '@/pages/products/hooks/useSearchProducts';

export default function TableSearchInput({
  placeholder
}: {
  placeholder?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const country = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = React.useState(country);

  // debounce the search input
  const [debouncedValue] = useDebounce(searchTerm, 1000);

  const handleSettingSearchParams = useCallback(
    (newSearchValue: string) => {
      if (!newSearchValue) {
        searchParams.delete('search');
        setSearchParams(searchParams);
        return;
      }
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: '1',
        search: newSearchValue
      });
    },
    [searchParams, setSearchParams]
  );
  const navigate = useNavigate();
  React.useEffect(() => {
    handleSettingSearchParams(debouncedValue);
  }, [debouncedValue, handleSettingSearchParams]);

  // Fetch search suggestions
  const { data } = useSearchProducts(debouncedValue);

  return (
    <div className="relative w-full md:max-w-sm">
      <Input
        placeholder={placeholder || `Search product...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      {data?.products.length ? (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
          {data.products.map((product) => (
            <li
              key={product.id}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {product.title}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
