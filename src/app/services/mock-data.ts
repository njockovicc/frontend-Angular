export const MOCK_USERS = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'admin@raf.rs',
    password: 'admin',
    permissions: [
      'create_user',
      'read_user',
      'update_user',
      'delete_user',
      'search_machine',
    ],
  },
  {
    id: '2',
    firstName: 'Pera',
    lastName: 'Peric',
    email: 'pera@raf.rs',
    password: 'pera',
    permissions: ['read_user'],
  },
  {
    id: '3',
    firstName: 'Zika',
    lastName: 'Zikic',
    email: 'zika@raf.rs',
    password: 'zika',
    permissions: ['read_user', 'search_machine'],
  },
];
