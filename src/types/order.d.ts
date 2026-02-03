
export type OrderFormState = {
    status?: string,
    errors?: {
        customer_name?: string[],
        status?: string[],
        table_id?: string[],
        _form?: string[],
    }
}