'use server'

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { updateUserSchemaForm } from "@/validations/auth-validation";
import { menuSchema } from "@/validations/menu-validation";

export async function createMenu(prevState: MenuFormState, formData: FormData) {
    let validatedFields = menuSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        discount: parseFloat(formData.get('discount') as string),
        category: formData.get('category'),
        image_url: formData.get('image_url'),
        is_available: formData.get('is_available') === 'true' ? true : false,
    })

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: []
            }
        }
    }

    if (validatedFields.data.image_url instanceof File) {
        const { errors, data } = await uploadFile('images', 'menus', validatedFields.data.image_url);
        if (errors) {
            return {
                status: 'error',
                errors: {
                    ...prevState.errors,
                    _form: [...errors._form]
                }
            }
        }

        validatedFields = {
            ...validatedFields,
            data: {
                ...validatedFields.data,
                image_url: data.url
            }
        }
    }

    const supabase = await createClient();
    const { error } = await supabase.from('menus').insert({
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        discount: validatedFields.data.discount,
        category: validatedFields.data.category,
        image_url: validatedFields.data.image_url,
        is_available: validatedFields.data.is_available
    })

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            }
        };
    };

    return {
        status: 'success'
    }

}


export async function updateMenu(prevState: MenuFormState, formData: FormData) {
    let validatedFields = updateUserSchemaForm.safeParse({
        name: formData.get('name'),
        role: formData.get('role'),
        avatar_url: formData.get('avatar_url'),
    })

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: []
            }
        }
    }

    if (validatedFields.data.avatar_url instanceof File) {
        const oldAvatarUrl = formData.get('old_avatar_url') as string;
        const { errors, data } = await uploadFile('images', 'users', validatedFields.data.avatar_url, oldAvatarUrl.split('/images/')[1]);

        if (errors) {
            return {
                status: 'error',
                errors: {
                    ...prevState.errors,
                    _form: [...errors._form]
                }
            }
        }

        validatedFields = {
            ...validatedFields,
            data: {
                ...validatedFields.data,
                avatar_url: data.url
            }
        }
    }

    const supabase = await createClient();
    const { error } = await supabase.from('profiles').update({
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: validatedFields.data.avatar_url
    }).eq('id', formData.get('id'));

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            }
        };
    };

    return {
        status: 'success'
    }

}


export async function deleteMenu(prevState: MenuFormState, formData: FormData) {
    const supabase = await createClient({ isAdmin: true })
    const image = formData.get('avatar_url') as string;
    const { status, errors } = await deleteFile('images', image.split('/images/')[1])


    if (status === 'error') {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [errors?._form?.[0] ?? "Unknown error"]
            }
        }
    }

    const { error } = await supabase.auth.admin.deleteUser(formData.get('id') as string)

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message]
            }
        }
    }

    return {
        status: "success"
    }


}
