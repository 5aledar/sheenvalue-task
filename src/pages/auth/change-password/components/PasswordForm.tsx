import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChangePassowrd } from '../../hooks/useChangePassword';
import toast from 'react-hot-toast';
import { useRouter } from '@/routes/hooks';

const formSchema = z
  .object({
    old_password: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
    }),
    new_password: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
    }),
    new_password_confirmation: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
    })
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

export default function PasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassowrd();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    changePassword(data, {
      onSuccess: () => {
        localStorage.removeItem('res_token');
        router.push('/login');
        toast.success('Password Changed Successfully');
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || 'Something went wrong');
      }
    });
  };

  return (
    <div className="w-full p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
