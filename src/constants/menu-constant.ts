

export const HEADER_TABLE_MENU = ["No", "Name", "Category", "Price", "Available", "Action"];

export const INITIAL_CREATE_MENU = {
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    image_url: '',
    is_available: '',
}

export const INITIAL_STATE_MENU = {
    status: 'idle',
    errors: {
        id: [],
        name: [],
        description: [],
        price: [],
        discount: [],
        image_url: [],
        category: [],
        is_available: [],
        _form: []
    }
}

export const CATEGORY_LIST =
    [
        {
            value: 'beverage',
            label: 'Beverage'
        },
        {
            value: 'main course',
            label: 'Main course'
        },
        {
            value: 'snack',
            label: 'Snack'
        },
    ]

export const AVAILABILITY_LIST =
    [
        {
            value: 'true',
            label: 'True'
        },
        {
            value: 'false',
            label: 'False'
        },

    ]