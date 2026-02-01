

export const HEADER_TABLE_TABLE = [
    'No',
    'Name',
    'Capacity',
    'Status',
    'Action',
];

export const INITIAL_TABLE = {
    name: '',
    capacity: '',
    description: '',
    status: ''
};

export const INIITAL_STATE_TABLE = {
    status: 'idle',
    errors: {
        id: [],
        name: [],
        description: [],
        capacity: [],
        status: [],
        _form: []
    }
}

export const STATUS_TABLE_LIST = [
    {
        value: 'available',
        label: 'Available',
    },
    {
        value: 'unavailable',
        label: 'Unavailable',
    },
    {
        value: 'reserved',
        label: 'Reserved',
    },
];