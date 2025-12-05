<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'ConfirmModal',
})
const props = withDefaults(defineProps<{
  title?: string
  isFooter?: boolean
}>(), {
  isFooter: true,
  title: '开始回传',
})
const loading = ref(false)
const visible = ref(false)
const handleOk = () => {
  visible.value = false
}
const onOpen = () => {
  visible.value = true
}
const onClose = () => {
  visible.value = false
}
const handleCancel = () => {
  onClose()
}

defineExpose({
  onOpen,
  onClose,
  loading,
})
</script>

<template>
  <a-modal v-model:open="visible" :title="props.title" wrap-class-name="customDialog">
    <div class="flex flex-col items-center justify-center gap-10px">
      <slot name="content">
        默认展示内容
      </slot>
      <!-- <img src="@/assets/svg/taskLedger/reback.svg" width="86">
      <span>是否开始回传，本次将上传XX G数据</span> -->
    </div>
    <template v-if="isFooter" #footer>
      <template v-if="$slots.footer">
        <slot name="footer" />
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确认
        </a-button>
      </template>
    </template>
  </a-modal>
</template>

<style lang="less">
.customDialog {
  .ant-modal-content {
    padding: 0;
  }
  .ant-modal-header {
    border-bottom: 1px solid #d8d8d8;
    padding: 0 16px;
  }
  .ant-modal-title {
    line-height: 50px;
  }
  .ant-modal-body {
    padding: 20px 16px;
  }
  .ant-modal-footer {
    border-top: 1px solid #d8d8d8;
    height: 50px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
