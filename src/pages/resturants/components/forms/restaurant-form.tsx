// export default ResturantForm;
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateResturant } from '../../hooks/useCreateResturant';
import { useUpdateRestaurant } from '../../hooks/useUpdateRestaurant';
import toast from 'react-hot-toast';
import { Resturant } from '../../lib/types';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useUploadImage } from '@/hooks/useUploadImage';
import { Switch } from '@/components/ui/switch';
import { useFetchCountries } from '@/hooks/useFetchCountries';
import { useFetchCities } from '@/hooks/useFetchCities';
import { useFetchAreas } from '@/hooks/useFetchAreas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const restaurantFormSchema = z.object({
  country_id: z.string().min(1, { message: 'Country is required' }),
  city_id: z.string().min(1, { message: 'City is required' }),
  area_id: z.string().min(1, { message: 'Area is required' }),
  address_en: z.string().min(1, { message: 'English address is required' }),
  address_ar: z.string().min(1, { message: 'Arabic address is required' }),
  address_tr: z.string().min(1, { message: 'Turkish address is required' }),
  name_en: z.string().min(1, { message: 'English name is required' }),
  name_ar: z.string().min(1, { message: 'Arabic name is required' }),
  name_tr: z.string().min(1, { message: 'Turkish name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  logo: z.string().optional(),
  latitude: z.string().min(1, { message: 'Latitude is required' }),
  longitude: z.string().min(1, { message: 'Longitude is required' }),
  facebook_url: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  instagram_url: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  contact_number: z.string().min(1, { message: 'Contact number is required' }),
  is_available: z.boolean(),
  start_time: z.string().min(1, { message: 'Start time is required' }),
  end_time: z.string().min(1, { message: 'End time is required' })
});

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

interface RestaurantFormProps {
  modalClose: () => void;
  resturant?: Resturant;
}

const RestaurantForm = ({ modalClose, resturant }: RestaurantFormProps) => {
  // Log the restaurant data for debugging
  console.log('Restaurant data received:', resturant);
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: resturant
      ? {
          country_id: resturant.country_id
            ? resturant.country_id.toString()
            : '',
          city_id: resturant.city_id ? resturant.city_id.toString() : '',
          area_id: resturant.area_id ? resturant.area_id.toString() : '',
          address_en: resturant.address_en || '',
          address_ar: resturant.address_ar || '',
          address_tr: resturant.address_tr || '',
          name_en: resturant.name_en || '',
          name_ar: resturant.name_ar || '',
          name_tr: resturant.name_tr || '',
          email: resturant.email || '',
          phone: resturant.phone || '',
          logo: resturant.logo || '',
          latitude: resturant.latitude || '',
          longitude: resturant.longitude || '',
          facebook_url: resturant.facebook_url || '',
          instagram_url: resturant.instagram_url || '',
          contact_number: resturant.contact_number || '',
          is_available:
            typeof resturant.is_available === 'boolean'
              ? resturant.is_available
              : true,
          start_time: resturant.start_time || '08:00',
          end_time: resturant.end_time || '23:00'
        }
      : {
          country_id: '',
          city_id: '',
          area_id: '',
          address_en: '',
          address_ar: '',
          address_tr: '',
          name_en: '',
          name_ar: '',
          name_tr: '',
          email: '',
          phone: '',
          logo: '',
          latitude: '',
          longitude: '',
          facebook_url: '',
          instagram_url: '',
          contact_number: '',
          is_available: true,
          start_time: '08:00',
          end_time: '23:00'
        }
  });

  const { mutate: createRestaurant, isPending: isCreating } =
    useCreateResturant();
  const { mutate: updateRestaurant, isPending: isUpdating } =
    useUpdateRestaurant();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const [previewImages, setPreviewImages] = useState<Record<string, string>>(
    {}
  );
  const { countries } = useFetchCountries();

  const { cities } = useFetchCities(form.watch('country_id'));
  const { areas } = useFetchAreas(form.watch('city_id'));

  const handleImageChange = (type: 'RESTAURANT_LOGO', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // Create a temporary preview URL for immediate feedback
    const tempPreviewUrl = URL.createObjectURL(file);
    setPreviewImages({ [type]: tempPreviewUrl });

    uploadImage(formData, {
      onSuccess: (response) => {
        try {
          // Revoke the temporary object URL to prevent memory leaks
          URL.revokeObjectURL(tempPreviewUrl);

          // Log the entire response to understand its structure
          console.log('Upload response data:', response);

          // Safely access the data structure
          if (response && response.data) {
            // Set the form value to the path returned from the server
            if (response.data.path) {
              form.setValue('logo', response.data.path);
            }

            // Use the complete URL from the server for the preview image
            // First try to get the URL, then fall back to path
            let serverImageUrl = '';
            if (response.data.url) {
              serverImageUrl = response.data.url;
            } else if (response.data.path) {
              serverImageUrl = response.data.path;
            }

            if (serverImageUrl) {
              setPreviewImages({ [type]: serverImageUrl });
              console.log('Image uploaded successfully:', serverImageUrl);
            } else {
              console.error('No valid image URL found in response');
              setPreviewImages({ [type]: '' });
            }
          } else {
            console.error('Invalid response structure:', response);
            setPreviewImages({ [type]: '' });
          }
        } catch (err) {
          console.error('Error processing upload response:', err);
          setPreviewImages({ [type]: '' });
        }
      },
      onError: (error) => {
        console.error(`Error uploading ${type} image:`, error);
        // Revoke the temporary object URL on error
        URL.revokeObjectURL(tempPreviewUrl);
        setPreviewImages({ [type]: '' });
      }
    });
  };

  const handleRemoveImage = (type: string) => {
    if (previewImages[type]) {
      // Only revoke if it's a blob URL (from local file)
      if (previewImages[type].startsWith('blob:')) {
        URL.revokeObjectURL(previewImages[type]);
      }
    }
    setPreviewImages((prev) => ({ ...prev, [type]: '' }));
    form.setValue('logo', '');
  };

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      console.log('Form data being submitted:', data);

      if (resturant) {
        console.log('Updating restaurant with ID:', resturant.id);

        // Create a clean copy of the data to avoid any reference issues
        const updateData = { ...data };

        updateRestaurant(
          { id: resturant.id, data: updateData },
          {
            onSuccess: () => {
              toast.success('Restaurant updated successfully');
              modalClose();
            },
            onError: (error: any) => {
              console.error('Update error details:', error);
              toast.error(error?.message || 'Failed to update restaurant');
            }
          }
        );
      } else {
        createRestaurant(data, {
          onSuccess: () => {
            toast.success('New restaurant added successfully');
            modalClose();
          },
          onError: (error: any) => {
            console.error('Create error details:', error);
            toast.error(error?.message || 'Failed to create restaurant');
          }
        });
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    try {
      if (resturant?.logo) {
        // For existing restaurants, use the logo URL directly
        const logoUrl = resturant.logo;
        console.log('Setting initial logo preview:', logoUrl);

        // Make sure we're setting a valid URL
        if (typeof logoUrl === 'string' && logoUrl.trim() !== '') {
          setPreviewImages({ RESTAURANT_LOGO: logoUrl });
        } else {
          console.warn('Invalid logo URL in restaurant data:', logoUrl);
        }
      }
    } catch (err) {
      console.error('Error setting initial logo preview:', err);
    }
  }, [resturant]);

  return (
    <div className="p-5">
      <Heading
        title={resturant ? 'Update Restaurant' : 'Create New Restaurant'}
        description=""
        className="space-y-2 py-4 text-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Country, City, Area */}
            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isCreating || isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      isCreating || isUpdating || !form.watch('country_id')
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      isCreating || isUpdating || !form.watch('city_id')
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas?.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Fields */}
            <FormField
              control={form.control}
              name="address_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address in English"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Arabic)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address in Arabic"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_tr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Turkish)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address in Turkish"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Fields */}
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name in English"
                      {...field}
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
                  <FormLabel>Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name in Arabic"
                      {...field}
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
                  <FormLabel>Name (Turkish)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name in Turkish"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contact Number"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logo"
              render={({}) => (
                <FormItem className="col-span-2">
                  <FormLabel>Logo</FormLabel>
                  {previewImages.RESTAURANT_LOGO ? (
                    <div className="relative">
                      <img
                        src={previewImages.RESTAURANT_LOGO}
                        alt="Logo preview"
                        className="h-40 w-40 rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('RESTAURANT_LOGO')}
                        className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageChange('RESTAURANT_LOGO', file);
                          }
                        }}
                        disabled={isUploading || isCreating || isUpdating}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coordinates */}
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Latitude"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Longitude"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="col-span-2">
              <FormLabel>Location on Map</FormLabel>
              <LocationPicker
                cityName={"damascus"
                  // cities?.find(c => c.id.toString() === form.watch('city_id'))?.name_en || ''
                }
                onLocationSelect={(lat, lng) => {
                  form.setValue('latitude', lat.toString());
                  form.setValue('longitude', lng.toString());
                }}
                initialPosition={
                  form.watch('latitude') && form.watch('longitude')
                    ? [
                      parseFloat(form.watch('latitude')),
                      parseFloat(form.watch('longitude'))
                    ]
                    : undefined
                }
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Click on the map to set the restaurant location
              </div>
              {form.formState.errors.latitude && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.latitude.message}
                </p>
              )}
            </div> */}
            {/* Social Media */}
            <FormField
              control={form.control}
              name="facebook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Facebook URL"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Instagram URL"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Working Hours */}
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={isCreating || isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
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
              {resturant ? 'Update Restaurant' : 'Create Restaurant'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantForm;
