import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import LogoutButton from '@/pages/auth/logout/components/LogoutButton';
import { useFetchProfile } from '@/pages/drivers/hooks/useFetchProfile';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';

export default function UserNav() {
  const { profile, isLoading } = useFetchProfile();

  const navigate = useNavigate();
  return (
    <DropdownMenu>
      {isLoading ? (
        <Skeleton className="rounded-full" />
      ) : (
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-14 w-14 rounded-full">
            <Avatar className=" h-8 w-8">
              <AvatarImage
                src={
                  'https://avatar.iran.liara.run/public/boy?username=mohanad'
                }
                alt={'admin'}
              />
              <AvatarFallback>
                <Skeleton className="rounded-full" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate('/change-password')}
            className="cursor-pointer hover:bg-secondary"
          >
            Change password
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
