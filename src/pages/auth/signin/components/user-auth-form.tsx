import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useLogin } from '../../hooks/useLogin';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import * as z from 'zod';
import toast from 'react-hot-toast';
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const { setToken } = useAuthStore();

  const { mutate: login, isPending } = useLogin();

  const onSubmit = async (data: UserFormValue) => {
    login(data, {
      onSuccess: (data) => {
        setToken(data.token);
        toast.success('Logged in successfully');
        router.push('/');
      },
      onError: (error: any) =>
        toast.error(error?.response?.data?.message || 'Login failed')
    });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    form.formState.errors.email ? 'text-red-500' : 'text-black'
                  }
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    form.formState.errors.password
                      ? 'text-red-500'
                      : 'text-black'
                  }
                >
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 pt-5">
            <p className="text-sm text-slate-500">
              Demo credentials: eve.holt@reqres.in / cityslicka
            </p>
            <Button
              disabled={isPending}
              className="ml-auto w-full bg-gradient-to-r from-[#F35827] to-[#F9972F] p-4 text-white"
              type="submit"
            >
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
