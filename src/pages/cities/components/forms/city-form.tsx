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
import { useCreateCity } from '../../hooks/useCreateCity';
import { useUpdateCity } from '../../hooks/useUpdateCity'; // Hook for updating city
import { useFetchCountries } from '@/pages/countries/hooks/useFetchCountries';
import toast from 'react-hot-toast';
import { Country, City } from '../../lib/types';

const cityFormSchema = z.object({
  name_en: z
    .string({ required_error: 'City name is required' })
    .min(1, { message: 'City name should be at least 1 character' }),
  name_ar: z
    .string({ required_error: 'City name is required' })
    .min(1, { message: 'City name should be at least 1 character' }),
  name_tr: z
    .string({ required_error: 'City name is required' })
    .min(1, { message: 'City name should be at least 1 character' }),
  country_id: z.string().min(1, { message: 'Country is required' })
});

type CityFormValues = z.infer<typeof cityFormSchema>;

interface CityFormProps {
  modalClose: () => void;
  city?: City;
}

const CityForm = ({ modalClose, city }: CityFormProps) => {
  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: city
      ? {
          name_en: city.name_en,
          name_ar: city.name_ar,
          name_tr: city.name_tr,
          country_id: String(city.country_id)
        }
      : { name_en: '', name_ar: '', name_tr: '', country_id: '' }
  });

  const { mutate: createCity, isPending: isCreating } = useCreateCity();
  const { mutate: updateCity, isPending: isUpdating } = useUpdateCity();
  const { countries, isLoading } = useFetchCountries(1);

  const onSubmit = async (data: CityFormValues) => {
    if (city) {
      // If city exists, update it
      updateCity(
        {
          id: city.id,
          data: {
            name_en: data.name_en,
            name_ar: data.name_ar,
            name_tr: data.name_tr,
            country_id: data.country_id
          }
        },
        {
          onSuccess: () => {
            toast.success('City updated successfully');
            modalClose();
          },
          onError: (error: any) => console.log(error)
        }
      );
    } else {
      // Otherwise, create a new city
      createCity(data, {
        onSuccess: () => {
          toast.success('New city added successfully');
          modalClose();
        },
        onError: (error: any) => console.log(error)
      });
    }
  };

  return (
    <div className="p-5">
      <Heading
        title={city ? 'Update City' : 'Create New City'}
        description=""
        className="space-y-2 py-4 text-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          {/* City Name Field */}
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
            name="country_id"
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
                        {countries?.map((country: Country) => (
                          <SelectItem
                            key={country.id}
                            value={String(country.id)}
                          >
                            {country.name}
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
              {city ? 'Update City' : 'Create City'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CityForm;
