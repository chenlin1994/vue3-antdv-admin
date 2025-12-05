<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  currentProcess?: number
  status?: string
}>(), {
  currentProcess: 0,
  status: 'success', // success, error, normal
})
const emits = defineEmits(['open'])
const statusMap = {
  normal: '待发布',
  success: '已发布',
  error: '失败',
}
const confirmRef = ref()
const handleClick = () => {
  confirmRef.value.onOpen()
}
</script>

<template>
  <div>
    <p>
      平台发布信息
    </p>
    <div
      class="status-info flex flex-nowrap items-center gap-10px"
      :class="({ normal: 'normal', success: 'success', error: 'error' })[props.status]"
    >
      <span class="flex flex-nowrap items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/publish_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/publish_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/storage_error.svg" alt="">
        <span class="flex flex-nowrap items-center gap-10px">发布状态:
          <span class="status">{{ statusMap[props.status] }}</span>
        </span>
        <a-progress :percent="50" :show-info="false" class="w-118px" :status="{ normal: 'normal', error: 'exception', success: 'success' }[props.status]" />
        <span v-if="['success', 'error'].includes(props.status)">[如需要更新FTP文件，请联系数据管理员]</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <Icon icon="ant-design:clock-circle-filled" class="status" />
        <span class="flex-1">发布时间:</span>
        <span>--</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/chart_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/chart_success.svg" alt="">
        <span class="flex-1">HIVE数据表名称:</span>
        <span>--</span>
      </span>
      <span v-if="props.status !== 'normal'" class="flex items-center gap-10px">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/report_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/report_error.svg" alt="">
        <span>质检报告：</span>
        <a-button size="small">查看</a-button>
      </span>
      <div class="flex-1 text-right">
        <a-button size="small" @click="emits('open')">
          查看详情>>
        </a-button>
      </div>
    </div>
    <div class="footer mt-16px flex items-center justify-right p-16px p-b-0">
      <a-button type="primary" @click="handleClick">
        开始数据准备
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.status-info {
  height: 40px;
  padding-left: 16px;
  &.normal {
    background: #f2f9ff;
    .status {
      color: #0084ff;
    }
  }
  &.success {
    background: rgba(0, 180, 42, 0.05);
    .status {
      color: #00b42a;
    }
  }
  &.error {
    background: rgba(245, 63, 63, 0.05);
    .status {
      color: #f53f3f;
    }
  }
}
:deep(.ant-progress-line) {
  width: 118px;
  margin-bottom: 2px;
}
.footer {
  border-top: 1px solid #e8e8e8;
}
:deep(.ant-select) {
  width: 100% !important;
}
</style>
