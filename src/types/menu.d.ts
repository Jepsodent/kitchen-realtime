

export type MenuFormState = {
    status?: string,
    errors?: {
        id?: string[],
        name?: string[],
        description?: string[],
        price?: string[],
        discount?: string[],
        image_url?: string[],
        category?: string[],
        is_available?: string[]
        _form?: string[]
    }
}

