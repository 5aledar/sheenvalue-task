import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '../../hooks/useLogout';
import { useRouter } from '@/routes/hooks';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface LogoutProps {
  isMinimized?: boolean;
}
const LogoutButton = ({ isMinimized }: LogoutProps) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { t } = useTranslation();
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/login');
      },
      onError: (error) => {
        toast.error('Logout failed');
      }
    });
  };

  return (
    <Button
      onClick={handleLogout}
      className="flex w-full justify-start gap-1 p-3 "
      disabled={isPending}
    >
      <LogOutIcon className="w-4" />
      {!isMinimized && t('auth.logout')}
    </Button>
  );
};

export default LogoutButton;
