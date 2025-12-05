<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Api from '@/api/index.ts'
import { Icon } from '@/components/basic/icon'
import { useEventbus } from '@/hooks/useEventbus'
import { useScrollY } from '@/hooks/useScrollY'
import ConfirmModal from '@/views/taskLedger/components/ConfirmModal.vue'
import MainPage from './components/MainPage.vue'

defineOptions({
  name: 'TaskLedger',
})
const eventBus = useEventbus()

const visible = ref(false)
const router = useRouter()
const formModel = ref<Record<string, any>>({})
const statusMap = {
  1: { title: '待回传', color: 'blue' },
  2: { title: '回传中', color: 'blue' },
  3: { title: '回传异常', color: 'red' },
  4: { title: '待准备', color: 'blue' },
  5: { title: '准备中', color: 'blue' },
  6: { title: '准备异常', color: 'red' },
  7: { title: '待发布', color: 'blue' },
  8: { title: '已完成', color: 'green' },
}
const options = ref({
  enableTestSystem: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
  status: Object.keys(statusMap).map(key => ({ label: statusMap[key].title, value: key })),
  accessControl: [{ label: '正常', value: 1 }, { label: '异常', value: 0 }],
  tapeBackup: [{ label: '有', value: 1 }, { label: '无', value: 0 }],
  discBackup: [{ label: '有', value: 1 }, { label: '无', value: 0 }],
  aircraftType: [{ label: '机型一', value: '机型一' }],
})
const showMore = ref(false)
const deleteModalRef = ref()
const columns = ref<Record<string, any>[]>([
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 160,
    resizable: true,
  },
  {
    title: '机型',
    dataIndex: 'aircraftType',
    key: 'aircraftType',
    width: 160,
    resizable: true,
  },
  {
    title: '架机号',
    dataIndex: 'aircraftNo',
    width: 160,
    key: 'aircraftNo',
  },
  {
    title: '任务单号',
    dataIndex: 'taskOrderNo',
    width: 160,
    key: 'taskOrderNo',
  },
  {
    title: '试飞科目',
    dataIndex: 'flightSubject',
    width: 160,
    key: 'flightSubject',
  },
  {
    title: '试飞日期',
    dataIndex: 'flightDate',
    key: 'flightDate',
    width: 160,
  },
  {
    title: '是否记录数据',
    dataIndex: 'recordData',
    key: 'recordData',
    width: 160,
    customRender: ({ record }) => {
      return ({ 1: '是', 0: '否' })[record.recordData]
    },
  },
  {
    title: '操作',
    width: 180,
    dataIndex: 'operation',
    fixed: 'right',
  },
])
const dataSource = ref<Record<string, any>[]>([])

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: total => `共${total}条`,
  onChange: (page, pageSize) => {
    pagination.current = page
    pagination.pageSize = pageSize
    getList()
  },
})
const getList = debounce(async () => {
  const data = await Api.taskLedger.getList({
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    condition: formModel.value,
  })
  dataSource.value = data.records
  pagination.total = data.total
}, 500)
const currentRow = ref<Record<string, any>>({})
eventBus.customOn('taksList:refresh', () => {
  getList()
})
function handleResizeColumn(w, col) {
  col.width = w
}
const tableBox = ref()
const { computedTableHeight } = useScrollY(tableBox, 140)
const add = () => {
  router.push({ name: 'taskLedger-createTask' })
}
const formModelRef = ref()
const reset = () => {
  formModelRef.value.resetFields()
  getList()
}
const gotoDetail = (record) => {
  router.push({ name: 'taskLedger-detail', query: { id: record.id, taskOrderNo: record.taskOrderNo } })
}

watchEffect(() => {
  formModel.value.flightStartDate = formModel.value.timeRange?.[0]
  formModel.value.flightEndDate = formModel.value.timeRange?.[1]
})
watch(() => formModel.value, () => {
  getList()
}, {
  deep: true,
})
const handleDel = (record: Record<string, any>) => {
  currentRow.value = record
  deleteModalRef.value.onOpen()
}
const del = async () => {
  await Api.taskLedger.del({ id: currentRow.value.id })
  getList()
  deleteModalRef.value.onClose()
}
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="h-100% w-100%">
    <MainPage>
      <template #header>
        <a-form ref="formModelRef" :model="formModel" :wrapper-col="{ span: 16 }" :label-col="{ span: 8 }">
          <a-row :gutter="8">
            <a-col :span="8">
              <a-form-item label="全局搜索" name="keyword" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }">
                <a-input-search v-model:value="formModel.keyword" placeholder="请输入" @search="getList" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :span="4">
              <a-form-item label="机型" name="aircraftType">
                <a-select v-model:value="formModel.aircraftType" :options="options.aircraftType" placeholder="请选择" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="任务单号" name="taskOrderNo">
                <a-input v-model:value="formModel.taskOrderNo" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="架机号" name="aircraftNo">
                <a-input v-model:value="formModel.aircraftNo" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否需要开启测试系统" name="enableTestSystem" :wrapper-col="{ span: 10 }" :label-col="{ span: 14 }">
                <a-select v-model:value="formModel.enableTestSystem" :options="options.enableTestSystem" placeholder="请选择" />
              </a-form-item>
            </a-col>
            <a-col :span="6" style="text-align:right">
              <a-space>
                <a-button type="primary" @click="showMore = !showMore">
                  更多查询
                  <Icon icon="ant-design:down-outlined" />
                </a-button>
                <a-button @click="reset">
                  清空
                  <Icon icon="ant-design:clear-outlined" />
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-row v-show="showMore" :gutter="8">
            <a-col :span="4">
              <a-form-item label="门禁情况" name="accessControl">
                <a-select v-model:value="formModel.accessControl" :options="options.accessControl" placeholder="请选择" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="科目信息" name="flightSubject">
                <a-input v-model:value="formModel.flightSubject" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="时间范围" name="timeRange">
                <a-range-picker v-model:value="formModel.timeRange" value-format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="状态" name="status" :wrapper-col="{ span: 10 }" :label-col="{ span: 14 }">
                <a-select v-model:value="formModel.status" :options="options.status" placeholder="请选择" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="磁带机备份" name="tapeBackup" :wrapper-col="{ span: 12 }" :label-col="{ span: 12 }">
                <a-select v-model:value="formModel.tapeBackup" :options="options.tapeBackup" placeholder="请选择" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="光盘备份" name="discBackup">
                <a-select v-model:value="formModel.discBackup" :options="options.discBackup" placeholder="请选择" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #content>
        <div ref="tableBox" class="table-box">
          <div class="control-buttons">
            <a-space>
              <a-button type="primary" ghost @click="add">
                新建
                <Icon icon="ant-design:plus-outlined" />
              </a-button>
              <a-popover v-model:open="visible" trigger="click" placement="bottom">
                <template #content>
                  <div>
                    <div class="upload-box">
                      <a-upload-dragger class="h-100% w-100%">
                        <img src="@/assets/images/upload.png" alt="">
                        <p class="mb-0">
                          拖拽或点击此处选择文件
                        </p>
                      </a-upload-dragger>
                    </div>
                    <a style="line-height:54px;padding-left:16px;">下载模版</a>
                  </div>
                </template>
                <a-button type="primary">
                  Excel导入
                  <Icon icon="ant-design:upload-outlined" class="rotate-180 font-600" />
                </a-button>
              </a-popover>

              <a-button style="color:#4C5A67;">
                导出
                <Icon icon="ant-design:upload-outlined" />
              </a-button>
            </a-space>
          </div>
          <a-table
            :columns="columns"
            :scroll="{ y: computedTableHeight, x: '100%' }"
            :data-source="dataSource"
            bordered
            size="small"
            :pagination="pagination"
            @resize-column="handleResizeColumn"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'operation'">
                <a-space>
                  <a-button type="link" @click="gotoDetail(record)">
                    详情
                  </a-button>
                  <a-button type="link" danger @click="handleDel(record)">
                    删除
                  </a-button>
                </a-space>
              </template>
              <template v-if="column.dataIndex === 'status'">
                <a-tag :color="statusMap[record.status]?.color" :bordered="false">
                  {{ statusMap[record.status]?.title }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </div>
      </template>
    </MainPage>
    <ConfirmModal ref="deleteModalRef" title="提示" :is-footer="true">
      <template #content>
        <div class="flex flex-col items-center justify-center gap-10px">
          <img src="@/assets/svg/taskLedger/delete.svg" width="86">
          <span>数据删除将无法恢复，是否确认删除</span>
        </div>
      </template>
      <template #footer>
        <a-button key="back" @click="() => deleteModalRef.onClose()">
          取消
        </a-button>
        <a-button key="submit" danger type="primary" @click="del">
          确认
        </a-button>
      </template>
    </ConfirmModal>
  </div>
</template>

<style lang="less" scoped>
.table-box {
  width: 100%;
  height: 100%;
  color: #4c5a67;
  .control-buttons {
    text-align: right;
    padding-bottom: 16px;
  }
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #fafafc;
  width: 291px;
  height: 166px;
  gap: 10px;
  :deep(.ant-upload) {
    @apply w-full h-full flex flex-col items-center justify-center gap-10px;
  }
}
:deep(.ant-tag) {
  line-height: 24px;
  padding: 0 16px;
  border-radius: 16px;
  width: 80px;
  text-align: center;
}
</style>
