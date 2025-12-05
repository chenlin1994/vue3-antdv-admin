<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  currentProcess?: number
  status?: string
}>(), {
  currentProcess: 0,
  status: 'error', // normal, success, error
})
const emits = defineEmits(['open'])
const statusMap = {
  normal: '进行中',
  success: '已完成',
  error: '异常',
}
const columns1 = ref([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '配置文件类型',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
  },
  {
    title: '数据源',
    dataIndex: 'taskSource',
    key: 'taskSource',
    width: 200,
  },
  {
    title: '配置文件名称',
    dataIndex: 'taskFile',
    key: 'taskFile',
    width: 200,
  },
])
const columns2 = ref([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '数据源',
    dataIndex: 'taskName',
    key: 'taskName',
    width: 200,
  },
  {
    title: '数据原路径',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
  },
  {
    title: '数据类型',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
  },
  {
    title: '文件数量',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
  },
  {
    title: '数据大小',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
])
const dataSource1 = ref<Record<string, any>[]>([])
const dataSource2 = ref<Record<string, any>[]>([])
const addRow = () => {
  dataSource1.value.push({
    index: dataSource1.value.length + 1,
    taskName: '',
    taskType: '',
    taskStatus: '',
    taskTime: '',
  })
}
</script>

<template>
  <div>
    <p>
      数据回传及存储信息
    </p>
    <div
      class="status-info flex items-center gap-10px"
      :class="({ normal: 'normal', success: 'success', error: 'error' })[props.status]"
    >
      <span class="flex flex-nowrap items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/storage_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/storage_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/storage_error.svg" alt="">
        <span class="flex flex-nowrap items-center gap-10px">储存状态:
          <span class="status">{{ statusMap[props.status] }}</span>
        </span>
        <a-progress :percent="50" :show-info="false" class="w-118px" :status="{ normal: 'normal', error: 'exception', success: 'success' }[props.status]" />
        <span v-if="['success', 'error'].includes(props.status)">[如需要更新FTP文件，请联系数据管理员]</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <Icon icon="ant-design:clock-circle-filled" class="status" />
        <span class="flex-1">储存执行时间:</span>
        <span>--</span>
      </span>
      <span v-if="props.status === 'normal'" class="min-w-0 flex items-center gap-10px">
        <img src="@/assets/svg/taskLedger/url_normal.svg" alt="">
        <span class="flex-1">存储路径:<span>--</span></span>
      </span>
      <span v-if="props.status !== 'normal'" class="flex items-center gap-10px">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/report_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/report_error.svg" alt="">
        <span>质检报告：</span>
        <a-button size="small">查看</a-button>
      </span>
      <span v-if="['success', 'error'].includes(props.status)" class="min-w-0 flex items-center justify-center gap-10px">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/url_success.svg" alt="">
        <img v-else src="@/assets/svg/taskLedger/url_normal.svg" alt="">
        <span class="flex-1">数据准备路径:<span>--</span></span>
      </span>
      <div class="flex-1 text-right">
        <a-button size="small" @click="emits('open')">
          查看详情>>
        </a-button>
      </div>
    </div>
    <a-table v-if="props.currentProcess === 0" size="small" bordered class="mt-16px" :columns="columns1" :data-source="dataSource1" :pagination="false">
      <template #title>
        <div class="flex items-center">
          <span class="flex-1">配置文件详情</span>
          <a-button size="middle" @click="addRow">
            重新推送OBS
          </a-button>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" danger>
            删除
          </a-button>
        </template>
        <template v-if="column.key === 'taskType'">
          <a-select :options="[]" />
        </template>
      </template>
    </a-table>
    <a-table size="small" bordered class="mt-16px" :columns="columns2" :data-source="dataSource2" :pagination="false">
      <template #title>
        <div class="flex items-center">
          <span class="flex-1">数据回传详情
          </span>
          <a-button size="middle" @click="addRow">
            重新推送OBS
          </a-button>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link">
            重新推送OBS
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="less" scoped>
.status-info {
  height: 40px;
  padding: 0 16px;
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
