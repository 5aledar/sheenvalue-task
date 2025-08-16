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
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '../../lib/types';
import { useFetchCategories } from '../../hooks/useFetchCategories';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';

const productFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, { message: 'Price must be a positive number' }),
  description: z.string().min(1, { message: 'Description is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  thumbnail: z.string().url({ message: 'Invalid image URL' })
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  modalClose: () => void;
  product?: Product;
}

const ProductForm = ({ modalClose, product }: ProductFormProps) => {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string>(
    product?.thumbnail || ''
  );

  const { data: categories, isLoading } = useFetchCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          title: product.title || '',
          price: product.price || 0,
          description: product.description || '',
          category: product.category || '',
          thumbnail: product.thumbnail || ''
        }
      : {
          title: '',
          price: 0,
          description: '',
          category: '',
          thumbnail: ''
        }
  });

  const handleRemoveImage = () => {
    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage('');
    form.setValue('thumbnail', '', { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data: ProductFormValues) => {
    if (product) {
      // Update existing product
      updateProduct(
        { id: product.id, data },
        {
          onSuccess: () => {
            toast.success('Product updated successfully');
            modalClose();
          },
          onError: (err: any) => {
            toast.error(err.message || 'Failed to update product');
          }
        }
      );
    } else {
      // Create new product
      createProduct(data, {
        onSuccess: () => {
          toast.success('Product created successfully');
          modalClose();
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to create product');
        }
      });
    }
  };

  return (
    <div className="overflow-y-scroll sm:p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-muted-foreground">
          Fill in the details to {product ? 'update' : 'create'} a product
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title & Price */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('title')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('productTitlePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('price')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={t('productPricePlaceholder')}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!isLoading &&
                      categories?.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Image</FormLabel>
                {previewImage ? (
                  <div className="relative inline-block">
                    <img
                      src={previewImage}
                      alt="Product preview"
                      className="h-32 w-32 rounded-lg border-2 border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://example.com/image.png"
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={modalClose}
              className="min-w-32"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              size="lg"
              className="min-w-32"
              disabled={isCreating || isUpdating}
            >
              {product ? t('updateProduct') : t('createProduct')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
