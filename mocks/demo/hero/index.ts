import heroListJson from './_heroList.json'
import heroLoLListJson from './_lolHeroList.json'

export default [
  {
    url: '/api/demo/wzry/hero_list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, cname = '', title = '' } = query
      const filterResult = heroListJson.filter((n) => {
        return n.cname.includes(cname) && n.title.includes(title)
      })
      return {
        code: 200,
        data: {
          page,
          pageSize,
          records: filterResult,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/demo/lol/hero_list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, cname = '', title = '' } = query
      const filterResult = heroLoLListJson.filter((n) => {
        return n.title.includes(title) && n.name.includes(name)
      })
      return {
        code: 200,
        data: {
          page,
          pageSize,
          records: filterResult,
        },
        msg: 'success',
      }
    },
  },

]
