<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Api from '@/api/index.ts'
import { useEventbus } from '@/hooks/useEventbus'

const eventBus = useEventbus()
const router = useRouter()
interface FormItem {
  label: string
  name: string
  type: string
  span: number
  multiple?: boolean
  rules?: any[]
  offset?: number
  options?: any[]
}
const formModelRef = ref()
const formModel = ref<Record<string, any>>({})
const formItems = ref<FormItem[]>([
  {
    label: '机型',
    name: 'aircraftType',
    type: 'select',
    span: 4,
    offset: 0,
    options: [{ label: '机型1', value: '1' }],
    rules: [{ required: true }],
  },
  {
    label: '架机号',
    name: 'aircraftNo',
    type: 'select',
    span: 4,
    offset: 4,
    options: [{ label: '驾机号1', value: '1' }],
    rules: [{ required: true }],
  },
  {
    label: '任务单号',
    name: 'taskOrderNo',
    type: 'input',
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞科目',
    name: 'flightSubject',
    type: 'select',
    span: 4,
    options: [{ label: '试飞科目1', value: '1' }],
    rules: [{ required: true }],
  },
  {
    label: '试飞地点(一体化)',
    name: 'flightSite',
    type: 'input',
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞起飞地点(一体化)',
    name: 'flightTakeoffSiteIntegration',
    type: 'input',
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞降落地点(一体化)',
    name: 'flightLandingSiteIntegration',
    type: 'input',
    span: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞起飞地点(台账)',
    name: 'flightTakeoffSiteLedger',
    type: 'select',
    options: [{ label: '试飞起飞地点1', value: '1' }],
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞降落地点(台账)',
    name: 'flightLandingSiteLedger',
    options: [{ label: '试飞降落地点1', value: '1' }],
    type: 'select',
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞地点(标准)',
    name: 'flightStandardSite',
    type: 'input',
    span: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞类别',
    name: 'testCategory',
    type: 'select',
    options: [{ label: '试飞类别1', value: '1' }],
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '试飞日期',
    name: 'flightDate',
    type: 'date',
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '是否记录数据',
    name: 'recordData',
    type: 'select',
    options: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
    span: 4,
    rules: [{ required: true }],
  },
  {
    label: '记录数据类型',
    name: 'recordDataType',
    type: 'select',
    multiple: true,
    options: [{ label: '类型1', value: '1' }],
    span: 4,
    offset: 4,
    rules: [{ required: true }],
  },
  {
    label: '备注',
    name: 'remark',
    type: 'textarea',
    span: 24,
  },

])
const formSetting = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}
const submit = async () => {
  await formModelRef.value.validate()
  await Api.taskLedger.add({ ...formModel.value, status: formModel.value?.status || '1' })
  eventBus.customEmit('taksList:refresh', 'true')
  router.push({ name: 'taskLedger' })
}
const cancel = () => {
  router.push({ name: 'taskLedger' })
}
const colLength = 3
</script>

<template>
  <div class="form-page">
    <div class="title">
      基本信息
    </div>
    <div class="form-content">
      <a-form
        ref="formModelRef"
        :colon="true"
        :model="formModel"
        layout="vertical"
        :label-col="formSetting.labelCol"
        :wrapper-col="formSetting.wrapperCol"
      >
        <a-row v-for="i in Math.ceil(formItems.length / colLength)" :key="i">
          <a-col v-for="item in formItems.slice((i - 1) * colLength, (i - 1) * colLength + colLength)" :key="item.label" :span="item.span" :offset="item.offset">
            <a-form-item :label="item.label" :name="item.name" :rules="item.rules">
              <a-input v-if="item.type === 'input'" v-model:value="formModel[item.name]" placeholder="请输入" />
              <a-select v-if="item.type === 'select'" v-model:value="formModel[item.name]" :options="item.options" placeholder="请选择" />
              <a-textarea v-if="item.type === 'textarea'" v-model:value="formModel[item.name]" placeholder="请输入" />
              <a-date-picker v-if="item.type === 'date'" v-model:value="formModel[item.name]" placeholder="请选择" value-format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="form-footer">
      <a-space>
        <a-button @click="cancel">
          取消
        </a-button>
        <a-button type="primary" @click="submit">
          创建
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import '@/styles/theme.less';
@borderColor: #d8d8d8;
.themeBgColor(form-page);
.form-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    border-bottom: 1px solid @borderColor;
    line-height: 54px;
    padding: 0 16px;
  }
  .form-content {
    padding: 16px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .form-footer {
    border-top: 1px solid @borderColor;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: right;
    margin: 0 16px;
  }
}
</style>
