export const UserResponseExample = {
  _id: '60d0fe4f5311236168a109ca',
  email: 'john.doe@example.com',
  phoneNumber: '0123456789',
  fullName: 'John Doe',
  username: 'johndoe',
  password: '****',
  image: 'https://img.freepik.com/user-icon.jpg',
  role: 'Member',
  gender: 'Male',
  dateOfBirth: '1990-01-01T00:00:00.000Z',
  address: [
    {
      street: '123 Street',
      district: 'District 1',
      city: 'HCM',
      nation: 'Vietnam'
    }
  ],
  accountType: 'normal',
  //   refreshTokens: [],
  isActive: true,
  verified: true,
  //   codeId: null,
  //   codeExpired: null,
  isDeleted: false,
  createdAtBy: {
    _id: '60d0fe4f5311236168a109cb',
    email: 'admin@example.com'
  },
  updatedAtBy: null,
  isDeletedBy: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  __v: 0
}

export const UserResponseExampleList = {
  message: 'Get all users successfully',
  data: {
    meta: {
      current: 1,
      limit: 10,
      pages: 100,
      total: 1000
    },
    result: [UserResponseExample]
  }
}
