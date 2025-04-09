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
import { useCreateRole } from '../../hooks/useCreateRole';
import { useUpdateRole } from '../../hooks/useUpdateRole'; // Hook for updating city
import toast from 'react-hot-toast';
import { Permission, Role } from '../../lib/types';
import { useFetchPermissions } from '../../hooks/useFetchPermissions';
import { useEffect } from 'react';

const roleFormSchema = z.object({
  name_en: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name should be at least 1 character' }),
  name_ar: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name should be at least 1 character' }),
  name_tr: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name should be at least 1 character' }),
  permissions: z.array(z.string()).min(1, 'At least one permission is required')
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  modalClose: () => void;
  role?: Role;
}

const RoleForm = ({ modalClose, role }: RoleFormProps) => {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: role
      ? {
          name_en: role.name_en,
          name_ar: role.name_ar,
          name_tr: role.name_tr,
          permissions: role?.permissions?.map((per) => per.name) || []
        }
      : { name_en: '', name_ar: '', name_tr: '', permissions: [] }
  });

  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  console.log(role);

  const onSubmit = async (data: RoleFormValues) => {
    if (role) {
      // If city exists, update it
      updateRole(
        { id: role.id, data },
        {
          onSuccess: () => {
            toast.success('Role updated successfully');
            modalClose();
          },
          onError: (error: any) => console.error(error)
        }
      );
    } else {
      // Otherwise, create a new city
      createRole(data, {
        onSuccess: () => {
          toast.success('New Role added successfully');
          modalClose();
        },
        onError: (error: any) => console.error(error)
      });
    }
  };
  const { permissions } = useFetchPermissions();
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value);
    });

    return () => subscription.unsubscribe();
  }, [form]);
  return (
    <div className="p-5">
      <Heading
        title={role ? 'Update Role' : 'Create New Role'}
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

          <FormField
            control={form.control}
            name="permissions"
            render={({ field }) => (
              <FormItem>
                <div className="mb-2 font-medium">Permissions</div>
                <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3">
                  {permissions?.map((perm: Permission) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={perm.name}
                        checked={field.value?.includes(perm.name)}
                        onChange={(e) => {
                          const value = perm.name;
                          field.onChange(
                            e.target.checked
                              ? [...field.value, value]
                              : field.value.filter((name) => name !== value)
                          );
                        }}
                      />

                      {perm.name}
                    </label>
                  ))}
                </div>
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
              {role ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoleForm;
