import z from "zod";
// type
export const menuSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    discount: z.number(),
    image_url: z.union([
        z.string(),
        z.instanceof(File)
    ]),
    category: z.string(),
    is_available: z.boolean()
})


// createMenu / update menu
export const createMenuSchemaForm = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.string().min(1, 'Price is required'),
    discount: z.string().min(1, 'Discount is required'),
    image_url: z.union([
        z.string().min(1, 'Image URL is required'),
        z.instanceof(File)
    ]),
    category: z.string().min(1, 'Category is required'),
    is_available: z.string().min(1, 'Availability is required')
})

export type Menu = z.infer<typeof menuSchema> & { id: string };
export type MenuSchemaForm = z.infer<typeof createMenuSchemaForm>;