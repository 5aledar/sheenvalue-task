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
import { useCreateDriver } from '../../hooks/useCreateDriver';
import toast from 'react-hot-toast';
import { City, Area, Driver } from '../../lib/types';
import { useFetchCities } from '@/pages/cities/hooks/useFetchCities';
import { Checkbox } from '@radix-ui/react-checkbox';
import { useUpdateDriver } from '../../hooks/useUpdateDriver';

export const driverFormSchema = z
  .object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    date_of_birth: z.string().min(1, { message: 'Date of birth is required' }),
    phone_number: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    nationality: z.string().min(1, { message: 'Nationality is required' }),
    national_id: z.string().min(1, { message: 'National ID is required' }),
    vehicle_type: z.enum(['CAR', 'MOTORCYCLE', 'BICYCLE']),
    plate_number: z.string().optional(),
    has_driving_license: z.number(),
    has_worked_before: z.number(),
    notes: z.string().nullable(),
    profile_image: z.instanceof(File || String).nullable(),
    vehicle_image: z.instanceof(File || String).nullable(),
    max_capacity: z.number().min(1, { message: 'Max capacity is required' }),
    vehicle_max_distance: z
      .number()
      .min(1, { message: 'Vehicle max distance is required' }),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    is_available: z.number(),
    starting_work_at: z.string().min(1, { message: 'Start time is required' }), // Consider Date if needed
    finishing_work_at: z
      .string()
      .min(1, { message: 'Finish time is required' }), // Consider Date if needed
    is_application_locked: z.number(),
    country_id: z.number().min(1, { message: 'Country is required' }),
    city_id: z.number().min(1, { message: 'City is required' }),
    area_id: z.number().min(1, { message: 'Area is required' })
  })
  .refine((data) => data.vehicle_type !== 'BICYCLE' || !data.plate_number, {
    message: 'Bicycles do not require a plate number',
    path: ['plate_number']
  })
  .refine((data) => data.vehicle_type !== 'CAR' || !!data.plate_number, {
    message: 'Plate number is required for cars',
    path: ['plate_number']
  });
type DriverFormValues = z.infer<typeof driverFormSchema>;

interface CityFormProps {
  modalClose: () => void;
  driver?: Driver; // Optional city prop for updating
}

const DriverForm = ({ modalClose, driver }: CityFormProps) => {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: driver
      ? {
          first_name: driver.first_name,
          last_name: driver.last_name,
          date_of_birth: driver.date_of_birth,
          phone_number: driver.phone_number,
          email: driver.email,
          nationality: driver.nationality,
          national_id: driver.national_id,
          vehicle_type: driver.vehicle_type,
          plate_number: driver.plate_number,
          has_driving_license: driver.has_driving_license,
          has_worked_before: driver.has_worked_before,
          notes: driver.notes,
          profile_image: driver.profile_image,
          vehicle_image: driver.vehicle_image,
          max_capacity: driver.max_capacity,
          vehicle_max_distance: driver.vehicle_max_distance,
          status: driver.status,
          is_available: driver.is_available,
          starting_work_at: driver.starting_work_at,
          finishing_work_at: driver.finishing_work_at,
          is_application_locked: driver.is_application_locked,
          country_id: driver.country_id,
          city_id: driver.city_id,
          area_id: driver.area_id
        }
      : {
          first_name: '',
          last_name: '',
          date_of_birth: '',
          phone_number: '',
          email: '',
          nationality: '',
          national_id: '',
          vehicle_type: 'CAR', // Default to CAR if not provided
          plate_number: '',
          has_driving_license: 0,
          has_worked_before: 0,
          notes: null,
          profile_image: null,
          vehicle_image: null,
          max_capacity: 1, // Default to 1 if not provided
          vehicle_max_distance: 1, // Default to 1 if not provided
          status: 'ACTIVE',
          is_available: true,
          starting_work_at: '',
          finishing_work_at: '',
          is_application_locked: 0,
          country_id: 0, // Adjust according to your default value
          city_id: 0, // Adjust according to your default value
          area_id: 0 // Adjust according to your default value
        }
  });

  const { cities, isLoading } = useFetchCities(1);
  const { mutate: createDriver, isPending: isCreating } = useCreateDriver();
  const { mutate: updateDriver, isPending: isUpdating } = useUpdateDriver();

  const onSubmit = async (data: DriverFormValues) => {
    // Create a new FormData instance to handle file uploads and other form fields
    const formData = new FormData();
    // Append non-file fields to FormData
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('phone_number', data.phone_number);
    formData.append('email', data.email);
    formData.append('nationality', data.nationality);
    formData.append('national_id', data.national_id);
    formData.append('vehicle_type', data.vehicle_type);
    formData.append('plate_number', String(data.plate_number));
    formData.append('has_driving_license', String(data.has_driving_license));
    formData.append('has_worked_before', String(data.has_worked_before));
    formData.append('notes', data.notes || '');
    formData.append('max_capacity', String(data.max_capacity));
    formData.append('vehicle_max_distance', String(data.vehicle_max_distance));
    formData.append('status', data.status);
    formData.append('is_available', String(data.is_available));
    formData.append('starting_work_at', data.starting_work_at);
    formData.append('finishing_work_at', data.finishing_work_at);
    formData.append(
      'is_application_locked',
      String(data.is_application_locked)
    );
    formData.append('country_id', String(data.country_id));
    formData.append('city_id', String(data.city_id));
    formData.append('area_id', String(data.area_id));

    // Append files (if any)
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }
    if (data.vehicle_image) {
      formData.append('vehicle_image', data.vehicle_image);
    }

    // If updating an existing driver, include the driver ID
    if (driver) {
      formData.append('id', String(driver.id)); // Append the driver's ID for updating

      // Call the update driver API
      updateDriver(
        { id: driver.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Driver updated successfully');
            modalClose();
          },
          onError: (error: any) => {
            toast.error('Failed to update driver');
            console.error(error);
          }
        }
      );
    } else {
      // If creating a new driver
      createDriver(formData, {
        onSuccess: () => {
          toast.success('New Driver created successfully');
          modalClose();
        },
        onError: (error: any) => {
          toast.error('Failed to create driver');
          console.error(error);
        }
      });
    }
  };

  return (
    <div className="p-5">
      <Heading
        title={driver ? 'Update Driver' : 'Create New Driver'}
        description=""
        className="space-y-2 py-4 text-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phone Number"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Type */}
          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="BICYCLE">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Plate Number */}
          <FormField
            control={form.control}
            name="plate_number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Plate Number"
                    {...field}
                    className="px-4 py-6 shadow-inner drop-shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Has Driving License */}
          <FormField
            control={form.control}
            name="has_driving_license"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    {...field}
                    checked={field.value === 1}
                    onChange={() => field.onChange(!field.value)} // toggle the value
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Has Worked Before */}
          <FormField
            control={form.control}
            name="has_worked_before"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value === 1}
                    onChange={(e) => field.onChange(e.target.checked ? 1 : 0)} // Store 1 for checked, 0 for unchecked
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Image */}
          <FormField
            control={form.control}
            name="profile_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    {...field}
                    disabled={isCreating || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Image */}
          <FormField
            control={form.control}
            name="vehicle_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Availability */}
          <FormField
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value === 1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City Select */}
          <FormField
            control={form.control}
            name="city_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {!isLoading && (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((city) => (
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

          {/* Submit Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              size="lg"
              onClick={modalClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
              {driver ? 'Update Driver' : 'Create Driver'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DriverForm;
