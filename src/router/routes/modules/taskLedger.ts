import type { RouteRecordRaw } from 'vue-router'
import { t } from '@/hooks/useI18n'

const moduleName = 'taskLedger'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/taskLedger',
    name: moduleName,
    redirect: '/taskLedger/index',
    meta: {
      title: t('routes.taskLedger.taskLedger'),
      icon: 'ant-design:dashboard-outlined',
    },
    children: [
      {
        path: 'index',
        name: `${moduleName}-taskLedger`,
        meta: {
          title: t('routes.taskLedger.taskLedger'),
          icon: 'ant-design:home-filled',
        },
        component: () => import('@/views/taskLedger/index.vue'),
      },
      {
        path: 'createTask',
        name: `${moduleName}-createTask`,
        meta: {
          hidden: true,
          hideInTabs: true,
          title: t('routes.taskLedger.create'),
          icon: 'ant-design:home-filled',
        },
        component: () => import('@/views/taskLedger/create.vue'),
      },
      {
        path: 'detail',
        name: `${moduleName}-detail`,
        meta: {
          // hidden: true,
          title: t('routes.taskLedger.detail'),
          hideInTabs: true,
          icon: 'ant-design:home-filled',
        },
        component: () => import('@/views/taskLedger/detail.vue'),
      },
    ],
  },
]

export default routes
