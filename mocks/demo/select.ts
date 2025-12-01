const demoList = (keyword, count = 20) => {
  const result = [] as any[]

  for (let index = 0; index < count; index++) {
    result.push({
      name: `${keyword ?? ''}选项${index}`,
      id: `${index}`,
    })
  }
  return result
}

export default [
  {
    url: '/select/getDemoOptions',
    method: 'get',
    response: ({ query }) => {
      const { keyword, count } = query
      return {
        code: 200,
        data: demoList(keyword, count),
        message: 'success',
      }
    },
  },

]
