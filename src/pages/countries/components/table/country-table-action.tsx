import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import CountryCreateForm from '../forms/country-form';

export default function CountryTableActions() {
  return (
    <div className="flex items-center justify-between gap-2 py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search Countries Here" />
      </div>
      <div className="flex gap-3">
        <PopupModal
          renderModal={(onClose) => <CountryCreateForm modalClose={onClose} />}
        />
      </div>
    </div>
  );
}
