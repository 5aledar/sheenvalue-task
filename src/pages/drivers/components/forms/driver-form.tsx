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
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateDriver } from '../../hooks/useCreateDriver';
import toast from 'react-hot-toast';
import { Driver } from '../../lib/types';
import { useFetchCities } from '@/pages/cities/hooks/useFetchCities';
import { useUpdateDriver } from '../../hooks/useUpdateDriver';
import { Label } from '@/components/ui/label';
import { useFetchCountries } from '@/pages/countries/hooks/useFetchCountries';
import { useFetchAreas } from '@/pages/areas/hooks/useFetchAreas';
import { useUploadImage } from '../../hooks/useUploadImage';
import { Checkbox } from '@/components/ui/checkbox';

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
    has_driving_license: z.boolean(),
    has_worked_before: z.boolean(),
    notes: z.string().nullable().optional(),
    profile_image: z.string().nullable().optional(),
    vehicle_image: z.string().nullable().optional(),
    max_capacity: z.number().min(1, { message: 'Max capacity is required' }),
    vehicle_max_distance: z
      .number()
      .min(1, { message: 'Vehicle max distance is required' }),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    is_available: z.boolean(),
    starting_work_at: z.string().min(1, { message: 'Start time is required' }),
    finishing_work_at: z
      .string()
      .min(1, { message: 'Finish time is required' }),
    is_application_locked: z.boolean(),
    country_id: z.number().min(1, { message: 'Country is required' }),
    city_id: z.number().min(1, { message: 'City is required' }),
    area_id: z.number().min(1, { message: 'Area is required' }),
    password: z.string().min(6, { message: 'Password is required' }).optional(),
    password_confirmation: z
      .string()
      .min(6, { message: 'Password confirmation is required' })
      .optional()
  })
  .refine((data) => data.vehicle_type !== 'CAR' || !!data.plate_number, {
    message: 'Plate number is required for cars',
    path: ['plate_number']
  })
  .refine((data) => data.vehicle_type !== 'BICYCLE' || !data.plate_number, {
    message: 'Bicycles do not require a plate number',
    path: ['plate_number']
  })
  .refine(
    (data) => !data.password || data.password === data.password_confirmation,
    {
      message: 'Passwords must match',
      path: ['password_confirmation']
    }
  );

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface CityFormProps {
  modalClose: () => void;
  driver?: Driver; // Optional city prop for updating
}

const DriverForm = ({ modalClose, driver }: CityFormProps) => {
  const [previewImages, setPreviewImages] = useState({
    DRIVER_PROFILE: null,
    DRIVER_VEHICLE: null
  });

  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const handleImageChange = (
    type: 'DRIVER_PROFILE' | 'DRIVER_VEHICLE',
    file: File
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [type]: previewUrl }));

    uploadImage(formData, {
      onSuccess: (data) => {
        console.log(data.data.url);

        if (type === 'DRIVER_PROFILE') {
          form.setValue('profile_image', data.data.url);
        } else {
          form.setValue('vehicle_image', data.data.url);
        }
      },
      onError: (error) => {
        console.error(`Error uploading ${type} image:`, error);
        setPreviewImages((prev) => ({ ...prev, [type]: null }));
      }
    });
  };

  const handleRemoveImage = (type: string) => {
    // Revoke the object URL to avoid memory leaks
    if (previewImages[type]) {
      URL.revokeObjectURL(previewImages[type]);
    }
    setPreviewImages((prev) => ({ ...prev, [type]: null }));
    if (type === 'DRIVER_PROFILE') {
      form.setValue('profile_image', '');
    } else {
      form.setValue('vehicle_image', '');
    }
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: driver
      ? {
          ...driver,
          date_of_birth: driver.date_of_birth.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
          starting_work_at: driver.starting_work_at
            .toTimeString()
            .split(' ')[0],
          finishing_work_at: driver.finishing_work_at
            .toTimeString()
            .split(' ')[0],
          has_driving_license: driver.has_driving_license === 1,
          has_worked_before: driver.has_worked_before === 1,
          is_available: driver.is_available === 1,
          is_application_locked: driver.is_application_locked === 1,
          profile_image: driver.profile_image ?? undefined,
          vehicle_image: driver.vehicle_image ?? undefined,
          password: undefined,
          password_confirmation: undefined
        }
      : {
          first_name: '',
          last_name: '',
          date_of_birth: '',
          phone_number: '',
          email: '',
          nationality: '',
          national_id: '',
          vehicle_type: 'CAR',
          plate_number: '',
          has_driving_license: false,
          has_worked_before: false,
          notes: '',
          profile_image: undefined,
          vehicle_image: undefined,
          max_capacity: 1,
          vehicle_max_distance: 1,
          status: 'ACTIVE',
          is_available: true,
          starting_work_at: '',
          finishing_work_at: '',
          is_application_locked: false,
          country_id: 0,
          city_id: 0,
          area_id: 0,
          password: '',
          password_confirmation: ''
        }
  });
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form values:', value);
      console.log('Form errors:', form.formState.errors);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const { cities, isLoading } = useFetchCities(1);
  const { countries } = useFetchCountries(1);
  const { areas } = useFetchAreas(1);
  const { mutate: createDriver, isPending: isCreating } = useCreateDriver();
  const { mutate: updateDriver, isPending: isUpdating } = useUpdateDriver();

  const onSubmit = async (data: DriverFormValues) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('phone_number', data.phone_number);
    formData.append('email', data.email);
    formData.append('nationality', data.nationality);
    formData.append('national_id', data.national_id);
    formData.append('vehicle_type', data.vehicle_type);
    formData.append('plate_number', String(data.plate_number));
    formData.append('notes', data.notes || '');
    formData.append('max_capacity', String(data.max_capacity));
    formData.append('vehicle_max_distance', String(data.vehicle_max_distance));
    formData.append('status', data.status);
    formData.append('starting_work_at', data.starting_work_at);
    formData.append('finishing_work_at', data.finishing_work_at);
    formData.append('country_id', String(data.country_id));
    formData.append('city_id', String(data.city_id));
    formData.append('area_id', String(data.area_id));

    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }
    if (data.vehicle_image) {
      formData.append('vehicle_image', data.vehicle_image);
    }
    const booleanFields = [
      'has_driving_license',
      'has_worked_before',
      'is_available',
      'is_application_locked'
    ];

    Object.entries(data).forEach(([key, value]) => {
      if (booleanFields.includes(key)) {
        formData.append(key, value ? '1' : '0');
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (driver) {
      formData.append('id', String(driver.id)); //
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
          <div className="flex gap-4">
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
          </div>

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Date of Birth"
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
          <div className="flex gap-4">
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
          </div>
          {!driver && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="px-4 py-6 shadow-inner drop-shadow-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                        className="px-4 py-6 shadow-inner drop-shadow-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex gap-4">
            {/* Vehicle Type */}
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-full">
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
                <FormItem className="w-full">
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
          </div>
          <div className="flex gap-4">
            {/* Has Driving License */}
            <FormField
              control={form.control}
              name="has_driving_license"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4"
                        disabled={isCreating || isUpdating}
                      />
                      <Label>Has driving license</Label>
                    </div>
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
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4"
                        disabled={isCreating || isUpdating}
                      />
                      <Label>Has Worked Before</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            {/* Profile Image */}
            <div className="w-full">
              {previewImages.DRIVER_PROFILE ? (
                <div className="relative">
                  <img
                    src={previewImages.DRIVER_PROFILE}
                    alt="Profile preview"
                    className="h-40 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('DRIVER_PROFILE')}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <FormField
                  name="profile_image"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageChange('DRIVER_PROFILE', file);
                              e.target.value = '';
                            }
                          }}
                          disabled={isUploading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Vehicle Image */}
            <div className="w-full">
              {previewImages.DRIVER_VEHICLE ? (
                <div className="relative">
                  <img
                    src={previewImages.DRIVER_VEHICLE}
                    alt="Vehicle preview"
                    className="h-40 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('DRIVER_VEHICLE')}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <FormField
                  name="vehicle_image"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageChange('DRIVER_VEHICLE', file);
                              e.target.value = '';
                            }
                          }}
                          disabled={isUploading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
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
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4"
                      disabled={isCreating || isUpdating}
                    />
                    <Label>Has driving license</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_application_locked"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4"
                      disabled={isCreating || isUpdating}
                    />
                    <Label>Application locked</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="starting_work_at"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      step="2"
                      {...field}
                      className="px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="finishing_work_at"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      step={'2'}
                      {...field}
                      className="px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            {/* City Select */}
            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    {!isLoading && (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country">
                            {field.value
                              ? countries?.find((c) => c.id === field.value)
                                  ?.name_en
                              : 'Select Country'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countries?.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={country.id.toString()}
                            >
                              {' '}
                              {/* Convert to string */}
                              {country.name_en}
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
            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    {!isLoading && (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select City">
                            {field.value
                              ? cities?.find((c) => c.id === field.value)
                                  ?.name_en
                              : 'Select City'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {cities?.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {' '}
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
          </div>
          <FormField
            control={form.control}
            name="area_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  {!isLoading && (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Area">
                          {field.value
                            ? areas?.find((a) => a.id === field.value)?.name_en
                            : 'Select Area'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {areas?.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name_en}
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
