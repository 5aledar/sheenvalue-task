import PageHead from '@/components/shared/page-head.jsx';
import PasswordForm from './components/PasswordForm';

export default function ChangePasswordPage() {
  return (
    <>
      <PageHead title="Dashboard | Change password" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-10  md:p-8">
        <PasswordForm />
      </div>
    </>
  );
}
