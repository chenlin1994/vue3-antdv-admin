import { faker } from '@faker-js/faker/locale/zh_CN'

export default [
  {
    url: '/api/api/auth/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          token: 'mock-token-12345',
          refreshToken: 'mock-refresh-token',
        },
      }
    },
  },
  {
    url: '/\/api\/\/user\/\d+/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: Array.from({ length: 10 }).map(() => ({
          fullname: faker.person.fullName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          address: faker.location.streetAddress(),
        })),
      }
    },
  },
]
