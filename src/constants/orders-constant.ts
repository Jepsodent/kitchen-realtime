

export const HEADER_TABLE_ORDER = [
    'No',
    'Order ID',
    'Customer Name',
    'Table',
    'Status',
    'Action'
]

export const INITIAL_ORDER = {
    customer_name: '',
    status: '',
    table_id: '',
}

export const INITIAL_STATE_ORDER = {
    status: 'idle',
    errors: {
        customer_name: [],
        status: [],
        table_id: [],
        _form: [],
    }
}

export const STATUS_CREATE_ORDER = [
    {
        value: 'reserved',
        label: 'Reserved'
    },
    {
        value: 'process',
        label: 'Process'
    },

]