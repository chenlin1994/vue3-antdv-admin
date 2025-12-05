<script lang="ts" setup>
import dayjs from 'dayjs'

defineOptions({
  name: 'History',
})
const props = withDefaults(defineProps<{
  data?: any[]
}>(), {
  data: () => [
    {
      title: '开始文件质检',
      status: undefined,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '文件质检规则',
      status: 'success',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '文件质检规则',
      status: 'success',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      extraInfo: {
        title: '异常文件:',
        data: [
          {
            label: '1.FTP/C919-DFWERWEF-565/压缩包1/飞行温度数居.cSV',
          },
        ],
      },
    },
    {
      title: '文件质检规则',
      status: 'error',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  ],
})
const statusMap = {
  normal: { color: '#0084FF', text: '正常' },
  success: { color: '#00B42A', text: '通过' },
  error: { color: '#F53F3F', text: '异常' },
}
</script>

<template>
  <a-timeline>
    <a-timeline-item v-for="(item, index) in props.data" :key="index" :color="statusMap[item.status]?.color">
      <p>
        <span>{{ item.title }}</span>
        <span v-if="['success', 'error'].includes(item.status)">
          结论：<span :style="{ color: statusMap[item.status]?.color }">{{ statusMap[item.status]?.text }}</span>
        </span>
        <span>{{ item.time }}</span>
      </p>
      <div v-if="item.extraInfo" class="info">
        <p>{{ item.extraInfo.title }}</p>
        <ul v-for="item1 in item.extraInfo.data" :key="item1.label">
          <li>{{ item1.label }}</li>
        </ul>
      </div>
    </a-timeline-item>
  </a-timeline>
</template>

<style lang="less" scoped>
:deep(.ant-timeline-item-content) {
  p {
    line-height: 24px;
  }
  > p:nth-child(1) {
    color: #4c5a67;
    line-height: 56px;
    border-bottom: 1px solid #efefef;
    @apply flex justify-between items-center;
  }
}
.info {
  background: #f6f7fb;
  padding: 16px;
}
</style>
