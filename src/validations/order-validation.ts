
import z from 'zod';

export const orderFormSchema = z.object({
    customer_name: z.string().min(1, 'Customer Name is required'),
    status: z.string().min(1, 'Select a required'),
    // table_id: z.string().min(1, 'Select a table'),
    table_id: z.string().min(1, 'Select a table').refine((val) => val !== "full", {
        message: "Semua meja penuh, tidak bisa buat order baru.",
    })
})

export type OrderForm = z.infer<typeof orderFormSchema>;