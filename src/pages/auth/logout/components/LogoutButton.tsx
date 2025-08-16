import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '../../hooks/useLogout';
import { useRouter } from '@/routes/hooks';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface LogoutProps {
  isMinimized?: boolean;
}
const LogoutButton = ({ isMinimized }: LogoutProps) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { logoutHandler } = useAuthStore();
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        logoutHandler();
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
      variant={'secondary'}
    >
      <LogOutIcon className="w-4" />
      {!isMinimized && 'Logout'}
    </Button>
  );
};

export default LogoutButton;
