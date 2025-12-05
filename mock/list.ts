import { faker } from '@faker-js/faker/locale/zh_CN'

export default [
  {
    url: '/api/api/task-orders/page/custom1',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          total: 100,
          records: Array.from({ length: 10 }).map(() => ({
            fullname: faker.person.fullName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            address: faker.location.streetAddress(),
          })),
        },
      }
    },
  },

]
