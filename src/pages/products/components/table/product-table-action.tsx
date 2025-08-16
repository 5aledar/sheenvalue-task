import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import CountryCreateForm from '../forms/product-form';

export default function RoleTableActions() {
  return (
    <div className="flex items-center justify-between gap-2 py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search Products Here" />
      </div>
      <div className="flex gap-3">
        <PopupModal
          variant={'default'}
          title="Add New"
          renderModal={(onClose) => <CountryCreateForm modalClose={onClose} />}
        />
      </div>
    </div>
  );
}
