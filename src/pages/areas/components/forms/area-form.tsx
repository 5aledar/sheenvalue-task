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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateArea } from '../../hooks/useCreateArea';
import { useUpdateArea } from '../../hooks/useUpdateArea'; // Hook for updating city
import toast from 'react-hot-toast';
import { City, Area } from '../../lib/types';
import { useFetchCities } from '@/pages/cities/hooks/useFetchCities';

const areaFormSchema = z.object({
  name_en: z
    .string({ required_error: 'Area name is required' })
    .min(1, { message: 'Area name should be at least 1 character' }),
  name_ar: z
    .string({ required_error: 'Area name is required' })
    .min(1, { message: 'Area name should be at least 1 character' }),
  name_tr: z
    .string({ required_error: 'Area name is required' })
    .min(1, { message: 'Area name should be at least 1 character' }),
  city_id: z.string().min(1, { message: 'City is required' })
});

type CityFormValues = z.infer<typeof areaFormSchema>;

interface CityFormProps {
  modalClose: () => void;
  area?: Area; // Optional city prop for updating
}

const CityForm = ({ modalClose, area }: CityFormProps) => {
  const form = useForm<CityFormValues>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: area
      ? {
          name_en: area.name_en,
          name_ar: area.name_ar,
          name_tr: area.name_tr,
          city_id: String(area.city_id)
        }
      : { name_en: '', name_ar: '', name_tr: '', city_id: '' }
  });

  const { mutate: createArea, isPending: isCreating } = useCreateArea();
  const { mutate: updateArea, isPending: isUpdating } = useUpdateArea();
  const { cities, isLoading } = useFetchCities(1);

  const onSubmit = async (data: CityFormValues) => {
    if (area) {
      updateArea(
        {
          id: area?.id,
          data: {
            name_en: data.name_en,
            name_ar: data?.name_ar,
            name_tr: data?.name_tr,
            country_id: data.city_id
          }
        },
        {
          onSuccess: () => {
            toast.success('Area updated successfully');
            modalClose();
          },
          onError: (error: any) => console.log(error)
        }
      );
    } else {
      createArea(data, {
        onSuccess: () => {
          toast.success('New Area added successfully');
          modalClose();
        },
        onError: (error: any) => console.log(error)
      });
    }
  };

  return (
    <div className="p-5">
      <Heading
        title={area ? 'Update Area' : 'Create New Area'}
        description=""
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
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name in English"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_ar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name in Arabic"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_tr"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name in Turkey"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country Select Field */}
          <FormField
            control={form.control}
            name="city_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {!isLoading && (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isCreating || isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((city: City) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              size="lg"
              onClick={modalClose}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full"
              size="lg"
              disabled={isCreating || isUpdating}
            >
              {area ? 'Update Area' : 'Create Area'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CityForm;
