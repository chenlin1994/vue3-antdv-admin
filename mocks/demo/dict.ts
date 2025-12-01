const getDictData = (dictType: string) => {
  if (dictType === 'gender') {
    return [
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 0,
      },
    ]
  }
  else if (dictType === 'sell_status') {
    return [
      {
        label: '已售罄',
        value: 0,
      },
      {
        label: '热卖中',
        value: 1,
      },
    ]
  }
  return []
}

export default [
  {
    url: '/api/dict/data',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 200,
        message: 'success',
        data: resultSuccess(getDictData(query.type)),
      }
    },
  },
]
