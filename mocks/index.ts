import type { MockMethod } from 'vite-plugin-mock'

// 自动导入当前文件夹下除了 index.ts 的所有 .ts 文件
const modules = import.meta.glob<MockMethod[]>('./**/*.ts', { eager: true })

const mocks: MockMethod[] = []

Object.entries(modules).forEach(([path,mod]) => {
  if (path.endsWith('index.ts')) { return }
  if ('default' in mod) {
    mocks.push(...mod.default)
  }
})
export default mocks
