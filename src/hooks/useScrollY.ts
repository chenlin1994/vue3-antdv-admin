import type { Ref } from 'vue'
import { throttle } from 'lodash-es'
import { onMounted, onUnmounted, ref, watch } from 'vue'
/**
 * 动态设置表格高度hook
 * @param baseTable   表格组件直接父容器
 * @param offset  补偿高度
 * @returns
 */
export const useScrollY = (baseTable: Ref<HTMLElement | null>, offset: number = 60) => {
  const computedTableHeight = ref()
  let resizeObserver: ResizeObserver | null = null
  const handleResize = throttle(() => {
    setTimeout(() => {
      computedTableHeight.value = (baseTable.value as HTMLElement).offsetHeight - offset
    })
  }, 10)

  onMounted(() => {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(() => {
        handleResize()
      })
    })
  })
  watch(
    () => baseTable.value,
    () => {
      resizeObserver?.observe(baseTable.value as HTMLElement)
      handleResize()
    },
  )
  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  return {
    computedTableHeight,
    handleResize,
  }
}
export default useScrollY
