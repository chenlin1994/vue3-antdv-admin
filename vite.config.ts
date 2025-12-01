import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dayjs from 'dayjs'
import Unocss from 'unocss/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevTools from 'vite-plugin-vue-devtools'
import pkg from './package.json'

const CWD = process.cwd()

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

/**
 * https://vitejs.dev/config/
 */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE, VITE_MOCK_IN_PROD } = loadEnv(mode, CWD)

  const isDev = command === 'serve'
  const isBuild = command === 'build'

  return {
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mocks', // mock文件夹位置
        enable: true, // 打包时是否也想开启 mock
        logger: true,
      }),
      VueDevTools(),
      Unocss(),
      vueJsx({
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(CWD, 'src/assets/icons')],
        symbolId: 'svg-icon-[dir]-[name]',
      }),
      Components({
        dts: 'types/components.d.ts',
        types: [
          {
            from: './src/components/basic/button/',
            names: ['AButton'],
          },
          {
            from: 'vue-router',
            names: ['RouterLink', 'RouterView'],
          },
        ],
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
            exclude: ['Button'],
          }),
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8088,
      open: true,
      proxy: {
        '^/api': {
          target: 'http://127.0.0.1:7001',
          secure: false,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
        '^/upload': {
          target: 'http://127.0.0.1:7001/upload',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/upload/, ''),
        },
      },
    },
    optimizeDeps: {
      include: ['lodash-es', 'ant-design-vue/es/locale/zh_CN', 'ant-design-vue/es/locale/en_US'],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE === 'true' ? ['console.log'] : [],
      drop: VITE_DROP_CONSOLE === 'true' ? ['debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      minify: 'esbuild',
      cssTarget: 'chrome108',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // minifyInternalExports: false,
        },
        onwarn(warning, rollupWarn) {
          // ignore circular dependency warning
          if (
            warning.code === 'CYCLIC_CROSS_CHUNK_REEXPORT'
            && warning.exporter?.includes('src/api/')
          ) {
            return
          }
          rollupWarn(warning)
        },
      },
    },
  }
}
