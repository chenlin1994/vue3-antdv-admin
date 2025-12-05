import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Api from '@/api/'
import { resetRouter } from '@/router'
import { generateDynamicRoutes } from '@/router/helper/routeHelper'
import { store } from '@/store'
import { useLockscreenStore } from './lockscreen'

export const useUserStore = defineStore(
  'user',
  () => {
    const lockscreenStore = useLockscreenStore()
    const token = ref<string>()
    const perms = ref<string[]>([])
    const menus = ref<RouteRecordRaw[]>([])
    const userInfo = ref<Partial<API.UserEntity>>({})

    const sortMenus = (menus: RouteRecordRaw[] = []) => {
      return menus
        .filter((n) => {
          const flag = !n.meta?.hideInMenu
          if (flag && n.children?.length) {
            n.children = sortMenus(n.children)
          }
          return flag
        })
        .sort((a, b) => ~~Number(a.meta?.orderNo) - ~~Number(b.meta?.orderNo))
    }

    /** 清空登录态(token、userInfo...) */
    const clearLoginStatus = () => {
      token.value = ''
      perms.value = []
      menus.value = []
      userInfo.value = {}
      resetRouter()
      setTimeout(() => {
        localStorage.clear()
      })
    }
    /** 登录成功保存token */
    const setToken = (_token: string) => {
      token.value = _token
    }

    /** 获取权限及菜单 */
    const fetchPermsAndMenus = async () => {
      const { accountPermissions, accountMenu } = Api.account
      // const wsStore = useWsStore();
      const [menusData, permsData] = await Promise.all([accountMenu(), accountPermissions()])
      // const [menusData, permsData] = [[], []]
      perms.value = permsData
      const result = generateDynamicRoutes(menusData as unknown as RouteRecordRaw[])
      menus.value = sortMenus(result)
    }
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    const afterLogin = async () => {
      try {
        const { accountProfile } = Api.account
        // const wsStore = useWsStore();
        const userInfoData = await accountProfile()
        // const userInfoData = {
        //   id: 1,
        //   createdAt: '2023-11-09T16:31:44.104Z',
        //   updatedAt: '2024-01-29T01:49:43.000Z',
        //   username: 'admin',
        //   nickname: 'bqy',
        //   avatar: 'https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777',
        //   qq: '1743369777',
        //   email: '1743369777@qq.com',
        //   phone: '10086',
        //   remark: '管理员',
        //   status: 1,
        //   roles: [
        //     {
        //       id: 1,
        //       createdAt: '2023-11-09T16:31:44.058Z',
        //       updatedAt: '2024-01-28T13:08:39.000Z',
        //       creator: null,
        //       updater: null,
        //       name: '管理员',
        //       value: 'admin',
        //       remark: '超级管理员',
        //       status: 1,
        //       default: null,
        //     },
        //   ],
        // }

        userInfo.value = userInfoData
        await fetchPermsAndMenus()
      }
      catch (error) {
        return Promise.reject(error)
        // return logout();
      }
    }
    /** 登录 */
    const login = async (params: API.LoginDto) => {
      try {
        const data = await Api.auth.authLogin(params)
        // const data = {
        //   token: 'mock-token-12345',
        //   refreshToken: 'mock-refresh-token',
        // }

        setToken(data.token)
        await afterLogin()
        lockscreenStore.setLock(false)
        lockscreenStore.saveLoginPwd(params.password)
      }
      catch (error) {
        return Promise.reject(error)
      }
    }

    /** 登出 */
    const logout = async () => {
      await Api.account.accountLogout()
      clearLoginStatus()
    }

    return {
      token,
      perms,
      menus,
      userInfo,
      login,
      afterLogin,
      logout,
      clearLoginStatus,
      fetchPermsAndMenus,
    }
  },
  {
    persist: {
      pick: ['token'],
    },
  },
)

/**
 * 在组件setup函数外使用
 */
export function useUserStoreWithOut() {
  return useUserStore(store)
}
