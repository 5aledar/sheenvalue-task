// export default ResturantForm;
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateResturant } from '../../hooks/useCreateResturant';
import { useUpdateRestaurant } from '../../hooks/useUpdateRestaurant';
import toast from 'react-hot-toast';
import { Resturant } from '../../lib/types';
import { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Image as ImageIcon,
  Store,
  Settings
} from 'lucide-react';
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
import { LocationPicker } from '../LocationPicker';
import { useTranslation } from 'react-i18next';

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
  // Use i18next for translations
  const { t } = useTranslation();

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
          logo:
            typeof resturant.logo === 'object'
              ? resturant.logo?.path || ''
              : resturant.logo || '',
          latitude: resturant.latitude ? resturant.latitude.toString() : '',
          longitude: resturant.longitude ? resturant.longitude.toString() : '',
          facebook_url: resturant.facebook_url || '',
          instagram_url: resturant.instagram_url || '',
          contact_number: resturant.contact_number || '',
          is_available:
            typeof resturant.is_available === 'boolean'
              ? resturant.is_available
              : true,
          start_time: resturant.start_time
            ? resturant.start_time.split(':').slice(0, 2).join(':')
            : '08:00',
          end_time: resturant.end_time
            ? resturant.end_time.split(':').slice(0, 2).join(':')
            : '23:00'
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

  // Fetch cities based on selected country
  const { cities, isLoading: isLoadingCities } = useFetchCities(
    form.watch('country_id')
  );

  // Fetch areas based on selected city
  const { areas } = useFetchAreas(form.watch('city_id'));

  // Ensure we fetch cities and areas when editing a restaurant
  useEffect(() => {
    if (resturant && resturant.country_id) {
      // This will trigger the useFetchCities hook
      form.setValue('country_id', resturant.country_id.toString());
    }
  }, [resturant, form]);

  // Ensure we fetch areas when cities are loaded
  useEffect(() => {
    if (
      resturant &&
      resturant.city_id &&
      !isLoadingCities &&
      cities?.length > 0
    ) {
      // This will trigger the useFetchAreas hook
      form.setValue('city_id', resturant.city_id.toString());
    }
  }, [resturant, cities, isLoadingCities, form]);

  // Ensure area is selected when areas are loaded
  useEffect(() => {
    if (resturant && resturant.area_id && areas?.length > 0) {
      form.setValue('area_id', resturant.area_id.toString());
    }
  }, [resturant, areas, form]);

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
              form.setValue('logo', response.data.path, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
              console.log('Logo form value set to:', response.data.path);
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
              console.log(
                'Current form values after logo upload:',
                form.getValues()
              );
              toast.success('Logo uploaded successfully');
            } else {
              console.error('No valid image URL found in response');
              setPreviewImages({ [type]: '' });
              toast.error('Failed to get image URL from server');
            }
          } else {
            console.error('Invalid response structure:', response);
            setPreviewImages({ [type]: '' });
            toast.error('Invalid response from server');
          }
        } catch (err) {
          console.error('Error processing upload response:', err);
          setPreviewImages({ [type]: '' });
          toast.error('Error processing upload response');
        }
      },
      onError: (error) => {
        console.error(`Error uploading ${type} image:`, error);
        // Revoke the temporary object URL on error
        URL.revokeObjectURL(tempPreviewUrl);
        setPreviewImages({ [type]: '' });
        toast.error('Failed to upload logo');
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
      console.log('Logo value in form data:', data.logo);

      // Validate that logo is present if required
      if (!data.logo || data.logo.trim() === '') {
        console.warn('No logo provided in form data');
      }

      // Helper function to format time to H:i format (remove seconds if present)
      // Server expects "H:i" format (e.g., "14:30") but HTML time input can include seconds
      const formatTimeToHi = (timeString: string): string => {
        if (!timeString) return timeString;
        // Remove seconds if present (e.g., "14:30:00" -> "14:30" or "04:39:00" -> "04:39")
        return timeString.split(':').slice(0, 2).join(':');
      };

      // Format the data properly for the server
      const formattedData = {
        ...data,
        // Ensure latitude and longitude are strings
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
        // Ensure time format is correct (H:i format - 24 hour format like "14:30")
        start_time: formatTimeToHi(data.start_time.trim()),
        end_time: formatTimeToHi(data.end_time.trim()),
        // Ensure IDs are strings
        country_id: data.country_id.toString(),
        city_id: data.city_id.toString(),
        area_id: data.area_id.toString()
      };

      console.log('Formatted data being sent:', formattedData);
      console.log('Time values:', {
        original_start_time: data.start_time,
        original_end_time: data.end_time,
        formatted_start_time: formattedData.start_time,
        formatted_end_time: formattedData.end_time,
        start_time_type: typeof formattedData.start_time,
        end_time_type: typeof formattedData.end_time
      });

      if (resturant) {
        console.log('Updating restaurant with ID:', resturant.id);

        updateRestaurant(
          { id: resturant.id, data: formattedData },
          {
            onSuccess: (response) => {
              console.log('Restaurant updated successfully:', response);
              toast.success('Restaurant updated successfully');
              modalClose();
            },
            onError: (error: any) => {
              console.error('Update error details:', error);

              // Handle validation errors specifically
              if (error?.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                  toast.error(`${key}: ${errors[key]}`);
                });
              } else {
                toast.error(error?.message || 'Failed to update restaurant');
              }
            }
          }
        );
      } else {
        console.log('Creating new restaurant with data:', formattedData);
        createRestaurant(formattedData, {
          onSuccess: (response) => {
            console.log('Restaurant created successfully:', response);
            toast.success('New restaurant added successfully');
            modalClose();
          },
          onError: (error: any) => {
            console.error('Create error details:', error);

            // Handle validation errors specifically
            if (error?.response?.data?.errors) {
              const errors = error.response.data.errors;
              Object.keys(errors).forEach((key) => {
                toast.error(`${key}: ${errors[key]}`);
              });
            } else {
              toast.error(error?.message || 'Failed to create restaurant');
            }
          }
        });
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      toast.error('An unexpected error occurred');
    }
  };

  // Set initial values when editing a restaurant
  useEffect(() => {
    try {
      // Set logo preview
      if (resturant?.logo) {
        let logoUrl = '';

        // Handle both object and string logo formats
        if (typeof resturant.logo === 'object' && resturant.logo?.url) {
          logoUrl = resturant.logo.url;
        } else if (typeof resturant.logo === 'string') {
          logoUrl = resturant.logo;
        }

        console.log('Setting initial logo preview:', logoUrl);

        // Make sure we're setting a valid URL
        if (logoUrl && logoUrl.trim() !== '') {
          setPreviewImages({ RESTAURANT_LOGO: logoUrl });
        } else {
          console.warn('Invalid logo URL in restaurant data:', resturant.logo);
        }
      }

      // Log the initial values for debugging
      if (resturant) {
        console.log('Initial form values:', {
          country_id: resturant.country_id,
          city_id: resturant.city_id,
          area_id: resturant.area_id
        });
      }
    } catch (err) {
      console.error('Error setting initial values:', err);
    }
  }, [resturant]);

  return (
    <div className="  max-h-[120vh] p-6">
      <div className="space-y-2 text-center">
        <Heading
          title={resturant ? 'Update Restaurant' : 'Create New Restaurant'}
          description="Fill in the information below to manage your restaurant"
          className="space-y-2"
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          autoComplete="off"
        >
          {/* Basic Information Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')} (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Restaurant name in English"
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
                      <FormLabel>{t('name')} (Arabic)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="اسم المطعم بالعربية"
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
                      <FormLabel>{t('name')} (Turkish)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Restoran adı Türkçe"
                          {...field}
                          disabled={isCreating || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('country')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCreating || isUpdating}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCountry')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries?.map((country: any) => (
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
                      <FormLabel>{t('city')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          isCreating || isUpdating || !form.watch('country_id')
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCity')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities?.map((city: any) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
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
                      <FormLabel>{t('area')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          isCreating || isUpdating || !form.watch('city_id')
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectArea')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {areas?.map((area: any) => (
                            <SelectItem
                              key={area.id}
                              value={area.id.toString()}
                            >
                              {area.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="address_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')} (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street address in English"
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
                      <FormLabel>{t('address')} (Arabic)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="العنوان بالعربية"
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
                      <FormLabel>{t('address')} (Turkish)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Türkçe adres"
                          {...field}
                          disabled={isCreating || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t('email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="restaurant@example.com"
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {t('phone')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {t('contactNumber')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 987-6543"
                          {...field}
                          disabled={isCreating || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t('facebookUrl')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/restaurant"
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
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t('instagramUrl')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/restaurant"
                          {...field}
                          disabled={isCreating || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Settings Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-primary" />
                Restaurant Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field: _field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {t('logo')}
                    </FormLabel>
                    <FormDescription>
                      Upload your restaurant logo (recommended size: 400x400px)
                    </FormDescription>
                    {previewImages.RESTAURANT_LOGO ? (
                      <div className="relative inline-block">
                        <img
                          src={previewImages.RESTAURANT_LOGO}
                          alt="Logo preview"
                          className="h-32 w-32 rounded-lg border-2 border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('RESTAURANT_LOGO')}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
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
                          className="cursor-pointer"
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Availability and Hours */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t('available')}
                        </FormLabel>
                        <FormDescription>
                          Restaurant is currently accepting orders
                        </FormDescription>
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

                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('openingTime')}
                      </FormLabel>
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
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('closingTime')}
                      </FormLabel>
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
            </CardContent>
          </Card>

          {/* Map Location Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Location on Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormItem>
                <FormLabel>{t('locationMap')}</FormLabel>
                <FormDescription>
                  Click on the map to set the exact location of your restaurant
                </FormDescription>
                <FormControl>
                  <div className="w-full">
                    {!isCreating && !isUpdating ? (
                      <LocationPicker
                        initialLat={form.watch('latitude') || '33.5138'}
                        initialLng={form.watch('longitude') || '36.2765'}
                        onLocationSelect={(lat, lng) => {
                          // Ensure coordinates are stored as strings with proper precision
                          const latString = lat.toFixed(6);
                          const lngString = lng.toFixed(6);

                          form.setValue('latitude', latString, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                          form.setValue('longitude', lngString, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                          console.log('Location updated:', {
                            lat: latString,
                            lng: lngString
                          });
                        }}
                      />
                    ) : (
                      <div className="flex h-80 w-full items-center justify-center rounded-md bg-muted">
                        <p className="text-muted-foreground">
                          Map loading is disabled while form is submitting...
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>

              {/* Hidden fields for latitude and longitude - now managed by the LocationPicker */}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={modalClose}
                  disabled={isCreating || isUpdating}
                  className="min-w-32"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isCreating || isUpdating}
                  className="min-w-32"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {resturant ? 'Updating...' : 'Creating...'}
                    </>
                  ) : resturant ? (
                    'Update Restaurant'
                  ) : (
                    'Create Restaurant'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantForm;
