<script lang="ts" setup>
import { ProModal } from 'antdv-draggable-modal'
import 'antdv-draggable-modal/dist/style.css'

withDefaults(
  defineProps<{
    title: string
    visible: boolean
    customizeStyle?: boolean
    loading?: boolean
  }>(),
  { title: '弹框', customizeStyle: false, loading: false },
)
const emit = defineEmits<{
  (e: 'ok', event: any): void
  (e: 'cancel', val: any): void
  (e: 'update:visible', val: boolean): void
}>()
/**
 * 点击确定按钮的回调
 */
const handleOk = (e: any) => {
  emit('ok', e)
}
/**
 * 点击取消按钮的回调
 */
const cancel = (e: any) => {
  emit('update:visible', false)
  emit('cancel', e)
}
</script>

<template>
  <ProModal
    ref="modalRef"
    v-bind="$attrs"
    :visible="visible"
    :wrap-style="{ overflow: 'hidden' }"
    :fullscreen="true"
    :style="{ maxWidth: '100vw', maxHeight: '100vh' }"
    :body-style="{
      maxHeight:
        $slots.footer || $attrs.footer !== null ? 'calc(100vh - 100px)' : 'calc(100vh - 55px)',
      overflowY: 'auto',
    }"
    :drag="true"
    :border-draw="true"
    @cancel="cancel"
  >
    <template #footer>
      <slot name="footer" />
      <template v-if="!$slots.footer && $attrs.footer !== null">
        <a-button key="back" @click="cancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确认
        </a-button>
      </template>
    </template>
    <slot name="content" />
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">
        {{ title }}
      </div>
    </template>
  </ProModal>
</template>

<style lang="less" scoped>
.customize-modal {
  :deep(.ant-modal-content) {
    .ant-modal-body {
      padding: 0;
    }
  }
}
</style>
