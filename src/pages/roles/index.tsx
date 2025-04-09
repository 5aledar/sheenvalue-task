import PageHead from '@/components/shared/page-head';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import RolesTable from './components';

export default function RolesPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHead title="Roles Management | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Roles', link: '/roles' }
        ]}
      />

      <RolesTable />
    </div>
  );
}
