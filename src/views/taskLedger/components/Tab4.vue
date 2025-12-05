<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  currentProcess?: number
  status?: string
}>(), {
  currentProcess: 0,
  status: 'normal', // success, error, normal
})
const emits = defineEmits(['open'])
const statusMap = {
  normal: '备份中',
  success: '已完成',
  error: '失败',
}
const dataSource = ref<Record<string, any>[]>([{
  index: 1,
  taskType: 1,
  taskSource: 10,
}, {
  index: 2,
  taskType: 1,
  taskSource: 10,
  button: true,
}, {
  index: 1,
  taskType: 2,
  taskSource: 20,
}, {
  index: 2,
  taskType: 2,
  taskSource: 20,
  button: true,
}])
const columns = computed(() => [
  {
    title: '光盘序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    customCell: (_, index) => {
      return initRowspan(_, index)
    },
  },
  {
    title: '备份介质编号',
    dataIndex: 'taskType',
    key: 'taskType',
    width: 200,
    customCell: (_, index) => {
      return initRowspan(_, index)
    },
  },
  {
    title: '备份文件编号',
    dataIndex: 'taskSource',
    key: 'taskSource',
    width: 200,
  },
])
const value = ref([])

const confirmRef = ref()
const handleClick = () => {
  confirmRef.value.onOpen()
}
const initRowspan = (_, index, field = 'taskType') => {
  const obj = {}
  dataSource.value.forEach((item) => {
    if (obj[item[field]]) {
      obj[item[field]].value++
    }
    else {
      obj[item[field]] = { value: 1 }
    }
  })
  const keys = Object.keys(obj)
  keys.forEach((key, index) => {
    const value = keys.slice(0, index + 1).reduce((prev, next) => prev + (obj[next]?.index ?? 0) + obj[next]?.value, 0) - obj[key].value
    obj[key].index = value
  })
  if (obj[_[field]].index === index) {
    return { rowSpan: obj[_[field]].value }
  }
  else {
    return { rowSpan: 0 }
  }
}
const addRow = () => {
  dataSource.value.push({
    index: dataSource.value.length + 1,
    taskName: '',
    taskType: '',
    taskStatus: '',
    taskTime: '',
  })
}
</script>

<template>
  <div>
    <template v-if="true">
      <p>数据备份记录</p>
      <div>
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label-align="left">
          <a-form-item label="请选择备份方式（可多选)">
            <a-checkbox-group v-model:value="value" :options="[{ label: '光盘', value: '0' }, { label: '磁带机', value: '1' }]" />
          </a-form-item>
        </a-form>
      </div>
    </template>
    <p>
      光盘备份记录
    </p>
    <div
      class="status-info flex flex-nowrap items-center gap-10px"
      :class="({ normal: 'normal', success: 'success', error: 'error' })[props.status]"
    >
      <span class="flex flex-nowrap items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/rStatus_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/rStatus_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/rStatus_error.svg" alt="">
        <span class="flex flex-nowrap items-center gap-10px">备份状态:
          <span class="status">{{ statusMap[props.status] }}</span>
        </span>
        <a-progress :percent="50" :show-info="false" class="w-118px" :status="{ normal: 'normal', error: 'exception', success: 'success' }[props.status]" />
        <span v-if="['success', 'error'].includes(props.status)">[如需要更新FTP文件，请联系数据管理员]</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/persion_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/persion_success.svg" alt="">
        <span class="flex-1">备份操作人员:</span>
        <span>--</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <Icon icon="ant-design:clock-circle-filled" class="status" />
        <span class="flex-1">备份时间:</span>
        <span>--</span>
      </span>
      <div class="flex-1 text-right">
        <a-button size="small" @click="emits('open')">
          查看详情>>
        </a-button>
      </div>
    </div>
    <a-table size="small" bordered class="mt-16px" :columns="columns" :data-source="dataSource" :pagination="false">
      <template #title>
        <div class="flex items-center">
          <span class="flex-1">配置文件详情(配置文件默认全量推送至数据准备服务器)</span>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'taskSource'">
          <a-button v-if="record.button" type="primary">
            新增编号
          </a-button>
          <span v-else>{{ record[column.dataIndex] }}</span>
        </template>
      </template>
    </a-table>
    <div class="flex justify-end p-b-16px p-t-16px">
      <a-button type="primary">
        光盘备份完成
      </a-button>
    </div>
    <p>磁带机备份信息</p>
    <div class="flex p-b-16px">
      <a-button type="primary" ghost>
        磁带机控制
      </a-button>
    </div>
    <div
      class="status-info flex flex-nowrap items-center gap-10px"
      :class="({ normal: 'normal', success: 'success', error: 'error' })[props.status]"
    >
      <span class="flex flex-nowrap items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/storage_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/storage_success.svg" alt="">
        <img v-if="props.status === 'error'" src="@/assets/svg/taskLedger/storage_error.svg" alt="">
        <span class="flex flex-nowrap items-center gap-10px">发布状态:
          <span class="status">{{ statusMap[props.status] }}</span>
        </span>
        <a-progress :percent="50" :show-info="false" class="w-118px" :status="{ normal: 'normal', error: 'exception', success: 'success' }[props.status]" />
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <img v-if="props.status === 'normal'" src="@/assets/svg/taskLedger/persion_normal.svg" alt="">
        <img v-if="props.status === 'success'" src="@/assets/svg/taskLedger/persion_success.svg" alt="">
        <span class="flex-1">备份操作人员:</span>
        <span>--</span>
      </span>
      <span class="min-w-0 flex items-center gap-10px">
        <Icon icon="ant-design:clock-circle-filled" class="status" />
        <span class="flex-1">备份时间:</span>
        <span>--</span>
      </span>
    </div>
    <div class="footer mt-16px flex items-center justify-right gap-10px p-16px p-b-0">
      <a-button type="primary">
        确认
      </a-button>
      <a-button type="primary" @click="handleClick">
        磁带机备份完成
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
:deep(.ant-table-tbody) {
  .ant-table-cell {
    padding: 8px !important;
  }
}
</style>
