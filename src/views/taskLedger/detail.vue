<script lang="tsx" setup>
import type { Edge, Node } from '@vue-flow/core'
import { MarkerType, VueFlow } from '@vue-flow/core'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Api from '@/api/index.ts'
import ConfirmModal from './components/ConfirmModal.vue'

import Histrory from './components/History.vue'
import SpecialEdge from './components/SpecialEdge.vue'
import SpecialNode from './components/SpecialNode.vue'
import Tab0 from './components/Tab0.vue'
import Tab1 from './components/Tab1.vue'
import Tab2 from './components/Tab2.vue'
import Tab3 from './components/Tab3.vue'
import Tab4 from './components/Tab4.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const route = useRoute()
interface FormItem {
  label: string
  name: string
  type: string
  span: number
  rules?: any[]
  offset?: number
  options?: any[]
  wrapperLable?: any
}
const activeKey = ref('1')
// 状态
const status = ref(0)
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'special',
    position: { x: 10, y: 5 },
    data: {
      label: '任务创建',
      status: 'green',
      type: 'create',
      current: true,
      handles: [{ direction: 'right', id: '1', type: 'source' }, { direction: 'bottom', id: '2', type: 'source' }],
    },
  },
  {
    id: '2',
    type: 'special',
    position: { x: 260, y: 5 },
    data: {
      label: '数据卸载及回传',
      status: 'red',
      type: 'dataBack',
      current: false,
      handles: [{ direction: 'left', id: '1', type: 'target' }],
    },
  },
  {
    id: '3',
    type: 'special',
    position: { x: 600, y: 100 },
    data: {
      label: '数据卸载及回传',
      status: 'red',
      type: 'dataBack',
      current: false,
      handles: [{ direction: 'left', id: '1', type: 'target' }],
    },
  },
])
const edges = ref<Edge[]>([
  {
    id: 'e1->2',
    // type: 'special',
    source: '1',
    target: '2',
    markerEnd: MarkerType.Arrow,
    style: {
      strokeWidth: 2,
      strokeDasharray: '5 3',
    },
    // animated: true,
    data: {
      hello: 'world',
    },
  },
  {
    id: 'e1->3',
    // type: 'special',
    source: '1',
    target: '3',
    markerEnd: MarkerType.Arrow,
    sourceHandle: '2',
    type: 'smoothstep',
    style: {
      strokeWidth: 2,
      strokeDasharray: '5 3',
    },
    // animated: true,
    data: {
      hello: 'world',
    },
  },
])
const formModel = ref({})
const formItems = ref<FormItem[]>([
  {
    label: '机型',
    name: 'aircraftType',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '架机号',
    name: 'aircraftNo',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '任务单号',
    name: 'taskOrderNo',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞科目',
    name: 'flightSubject',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞地点(一体化)',
    name: 'flightSite',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞起飞地点(一体化)',
    name: 'flightTakeoffSiteIntegration',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞降落地点(一体化)',
    name: 'flightLandingSiteIntegration',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞起飞地点(台账)',
    name: 'flightTakeoffSiteLedger',
    type: 'select',
    span: 6,
    rules: [{ required: true }],

  },
  {
    label: '试飞降落地点(台账)',
    name: 'flightLandingSiteLedger',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞地点',
    name: 'flightStandardSite',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞类别',
    name: 'testCategory',
    type: 'select',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '试飞日期',
    name: 'flightDate',
    type: 'date',
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '是否记录数据',
    name: 'recordData',
    type: 'select',
    options: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
    span: 6,
    rules: [{ required: true }],
  },
  {
    label: '备注',
    name: 'name',
    type: 'textarea',
    span: 24,
    wrapperLable: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
  },

])
const settingFormRef = ref()
const settingFormRebackRef = ref()
const open = ref(false)
const onOpen = () => {
  open.value = true
}
const onClose = () => {
  open.value = false
}
const formModelRef = ref()
const colLength = 4
// 表单编辑
const isEdit = ref(false)
// 表单固定
const sticky = ref(false)
const processList = ref(['子任务一', '子任务二'])
const currentProcess = ref(0)
const closeProcess = () => {
  settingFormRebackRef.value.onOpen()
}
const addProcess = () => {
  processList.value.push('子任务二')
}
const changeProcess = (val) => {
  currentProcess.value = val
}

const getDetail = async () => {
  const data = await Api.taskLedger.detail({ id: route.query.id })
  await Api.taskLedger.getProcessDetail({ taskOrderId: route.query.id })
  formModel.value = data
  console.log(data)
}
const updateForm = async () => {
  await formModelRef.value.validate()
  await Api.taskLedger.edit({ ...formModel.value, status: formModel.value.status || '1' })
  isEdit.value = false
}
const handleOk = async (type) => {
  if (type === 1) {
    // processList.value.push('子任务二')
    // settingFormRebackRef.value.onClose()
  }
  else if (type === 2) {
    processList.value.pop()
    settingFormRebackRef.value.onClose()
  }
}
onMounted(async () => {
  try {
    await getDetail()
  }
  catch (error) {

  }
  finally {
    // nextTick(() => {
    //   settingFormRef.value.onOpen()
    // })
  }
})
</script>

<template>
  <div class="detail-page">
    <div class="detail-top" :class="sticky ? 'sticky' : ''">
      <div>
        <p class="title">
          <span class="icon"><img src="~@/assets/svg/taskLedger/taskTitle.svg" alt=""></span>
          <span style="min-width:0;flex:1;">任务单号: {{ formModel.taskOrderNo }}</span>
          <span>
            <a-space>
              <a-button v-if="!sticky" type="primary" @click="sticky = !sticky">固定<Icon icon="tabler:pin" /></a-button>
              <a-button v-else @click="sticky = !sticky">固定<Icon icon="tabler:pin" /></a-button>
              <a-button v-if="!isEdit" type="primary" ghost @click="isEdit = !isEdit">编辑<Icon icon="ep:edit" /></a-button>
              <a-button v-else type="primary" @click="updateForm">保存</a-button>
            </a-space>
          </span>
        </p>
        <a-form
          ref="formModelRef"
          :colon="true"
          :model="formModel"
          label-align="left"
          :label-col="{ span: 10 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-row v-for="i in Math.ceil(formItems.length / colLength)" :key="i" :gutter="16">
            <a-col v-for="item in formItems.slice((i - 1) * colLength, (i - 1) * colLength + colLength)" :key="item.label" :span="item.span" :offset="item.offset">
              <a-form-item :label="item.label" :name="item.name" :rules="isEdit ? item.rules : []" v-bind="item.wrapperLable ? item.wrapperLable : {}">
                <template v-if="isEdit">
                  <a-input v-if="item.type === 'input'" v-model:value="formModel[item.name]" />
                  <a-select v-if="item.type === 'select'" v-model:value="formModel[item.name]" :options="item.options || []" />
                  <a-textarea v-if="item.type === 'textarea'" v-model:value="formModel[item.name]" :auto-size="{ minRows: 1, maxRows: 1 }" />
                  <a-date-picker v-if="item.type === 'date'" v-model:value="formModel[item.name]" value-format="YYYY-MM-DD" />
                </template>
                <template v-else>
                  {{ formModel[item.name] }}
                </template>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="process-box">
      <p class="title">
        <span class="icon" style="background-color: #00B42A"><img src="~@/assets/svg/taskLedger/process.svg" alt=""></span>
        <span>流程进度</span>
        <span class="process-tab">
          <span v-for="(item, index) in processList" :key="index" :class="currentProcess === index ? 'active' : ''" @click="changeProcess(index)">
            <span>{{ item }}</span>
            <Icon v-if="index === 1" icon="ant-design:close-circle-filled" class="closeIcon absolute right-0 top-0 translate-x-1/2 cursor-pointer -translate-y-1/2" @click.stop="closeProcess" />
          </span>
          <a-button v-if="processList.length === 1" class="ml-10px" @click="addProcess">新增<Icon icon="ant-design:plus-outlined" /></a-button>
        </span>
      </p>
      <div class="process">
        <VueFlow
          :nodes="nodes" :edges="edges"
          :zoom-on-scroll="false"
          :nodes-draggable="false"
          :pan-on-drag="false"
          :elements-draggable="false"
        >
          <template #node-special="specialNodeProps">
            <SpecialNode v-bind="specialNodeProps" />
          </template>
          <template #edge-special="specialEdgeProps">
            <SpecialEdge v-bind="specialEdgeProps" />
          </template>
        </VueFlow>
      </div>
    </div>
    <div class="detail-bottom">
      <a-tabs v-model:active-key="activeKey">
        <template v-if="status === 0">
          <a-tab-pane key="1" tab="数据卸载及回传">
            <Tab0 :current-process="currentProcess" @open="onOpen" />
          </a-tab-pane>
        </template>
        <template v-else>
          <a-tab-pane key="1" tab="数据回传及存储">
            <Tab1 :current-process="currentProcess" @open="onOpen" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="数据准备">
            <Tab2 :current-process="currentProcess" @open="onOpen" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="平台发布">
            <Tab3 :current-process="currentProcess" @open="onOpen" />
          </a-tab-pane>
          <a-tab-pane key="4" tab="数据备份">
            <Tab4 :current-process="currentProcess" @open="onOpen" />
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>
    <a-drawer
      v-model:open="open"
      title="回传进度"
      width="520"
      :closable="true"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <Histrory />
    </a-drawer>
    <ConfirmModal ref="settingFormRef" title="提示" :is-footer="true">
      <template #content>
        <div class="flex flex-col items-center justify-center gap-10px">
          <img src="@/assets/svg/taskLedger/backConfirm.svg" width="114">
          <p>原始、工程量数据是否需要和其他类型数据分开回传？</p>
        </div>
      </template>
      <template #footer>
        <a-button key="back" @click="() => settingFormRef.onClose()">
          否
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk(1)">
          是
        </a-button>
      </template>
    </ConfirmModal>
    <ConfirmModal ref="settingFormRebackRef" title="提示" :is-footer="true">
      <template #content>
        <div class="flex flex-col items-center justify-center gap-10px">
          <img src="@/assets/svg/taskLedger/rebackForm.svg" width="114">
          <p>原始、工程量数据是否合并为整单回传？</p>
        </div>
      </template>
      <template #footer>
        <a-button key="back" @click="() => settingFormRebackRef.onClose()">
          否
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk(2)">
          是
        </a-button>
      </template>
    </ConfirmModal>
  </div>
</template>

<style lang="less" scoped>
@import '@/styles/theme.less';
.themeBgColor(detail-top);
.themeBgColor(detail-bottom);
.detail-page {
  width: 100%;
  height: calc(100% - 16px);
  position: relative;
  overflow-y: auto;
  padding: 16px;
  margin-top: 16px;
  padding-top: 0;
  background: #f5f5f5;
  .detail-top {
    padding: 16px;
    &.sticky {
      position: sticky;
      z-index: 1;
      top: 0;
    }
  }
  .detail-bottom {
    margin-top: 16px;
    padding: 16px;
  }
}
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #0084ff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .process-tab {
    display: flex;
    & > span {
      height: 32px;
      line-height: 32px;
      border: 1px solid #dcdee1;
      padding: 0 16px;
      position: relative;
      cursor: pointer;
      &:nth-child(2) {
        border-left: none;
        &:hover {
          .closeIcon {
            visibility: visible;
          }
        }
      }
      &.active {
        background: #0084ff;
        span {
          color: white;
        }
      }
      .closeIcon {
        visibility: hidden;
        z-index: 1;
      }
    }
  }
}
.process-box {
  border-top: 1px solid #efefef;
  background: #fff;
  padding: 16px;
  .process {
    height: 240px;
    background: rgba(246, 247, 251, 0.8);
  }
}
</style>
