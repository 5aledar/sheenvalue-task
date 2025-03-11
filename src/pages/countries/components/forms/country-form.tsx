import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCountry } from '../../hooks/useCreateCountry';
import toast from 'react-hot-toast';

const countryFormSchema = z.object({
  name: z
    .string({ required_error: 'Country name is required' })
    .min(1, { message: 'firstname is should be at least 1 character' }),
  currency: z.string().min(2, { message: 'currency is required' }),
  code: z.string().min(1, { message: 'code is required' })
});

type countryFormValue = z.infer<typeof countryFormSchema>;

const CountryCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const form = useForm<countryFormValue>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {}
  });
  const { mutate: createCountry, isPending } = useCreateCountry();
  const onSubmit = async (data: countryFormValue) => {
    console.log(data);

    createCountry(data, {
      onSuccess: () => {
        toast.success(' new country added successfully');
        modalClose();
      },
      onError: (error: any) => console.log(error)
    });
  };

  return (
    <div className="p-5">
      <Heading
        title={'Create New Country'}
        description={''}
        className="space-y-2 py-4 text-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="USA"
                    {...field}
                    className=" px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="USD"
                    {...field}
                    className=" px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Z100"
                    {...field}
                    className=" px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full "
              size="lg"
              onClick={modalClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="rounded-full"
              size="lg"
            >
              Create Country
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CountryCreateForm;
