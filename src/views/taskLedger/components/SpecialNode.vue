<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import createIcon from '@/assets/svg/taskLedger/create.svg'
import dataBackIcon from '@/assets/svg/taskLedger/dataBack.svg'

const props = defineProps<NodeProps>()
const x = computed(() => `${Math.round(props.position.x)}px`)
const y = computed(() => `${Math.round(props.position.y)}px`)
const imgMap = {
  create: createIcon,
  dataBack: dataBackIcon,
}
</script>

<template>
  <div
    class="vue-flow__node-default" :class="[props.data.status, { current: props.data.current }]"
  >
    <div class="content h-100% flex flex-col justify-center">
      <div class="node-title flex flex-1 items-center justify-left">
        <div class="img flex items-center justify-center" :class="props.data.type">
          <img :src="imgMap[props.data.type]">
        </div>
        <span style="font-size:14px;">{{ data.label }}
        </span>
      </div>
      <div class="flex flex-1 items-center justify-left">
        系统自动创建
      </div>
      <div class="flex flex-1 items-center justify-left">
        {{ '2025-05-23 17:21:00' }}
      </div>
    </div>

    <Handle
      v-for="item in props.data.handles"
      :id="item.id"
      :key="item.id"
      class="handle"
      :class="[item.direction]"
      :type="item.source"
      :position="({ right: Position.Right, left: Position.Left, top: Position.Top, bottom: Position.Bottom })[item.direction]"
    />
  </div>
</template>

<style lang="less" scoped>
.vue-flow__node-default {
  height: 132px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 180, 42, 0.3);
  border-color: transparent;
  &.green {
    box-shadow: 0px 4px 8px 0px rgba(0, 180, 42, 0.3);
    &.current {
      border: 1px solid #00b42a;
    }
    .handle {
      background: #00b42a;
    }
  }
  &.red {
    box-shadow: 0px 4px 12px 0px rgba(245, 63, 63, 0.3);
    &.current {
      border: 1px solid #f53f3f;
    }
    .handle {
      background: #f53f3f;
    }
  }
  &.blue {
    box-shadow: 0px 4px 12px 0px rgba(0, 132, 255, 0.3);
    &.current {
      border: 1px solid #0084ff;
    }
    .handle {
      background: #0084ff;
    }
  }
  &.normal {
    box-shadow: 0px 4px 12px 0px #e4ecf6;
    &.current {
      border: 1px solid #eaecef;
    }
    .handle {
      background: #dcdee1;
    }
  }
  .handle {
    border: none;
    &.right {
      height: 36px !important;
      width: 4px;
      border-radius: 0px 6px 6px 0px;
      top: 50%;
      right: -4px;
      transform: translateY(-50%);
    }
    &.left {
      height: 36px !important;
      width: 4px;
      border-radius: 6px 0px 0px 6px;
      top: 50%;
      left: -4px;
      transform: translateY(-50%);
    }
    &.top {
      height: 4px !important;
      width: 36px;
      border-radius: 6px 6px 0px 0px;
      top: -4px;
      left: 50%;
      transform: translateX(-50%);
    }
    &.bottom {
      height: 4px !important;
      width: 36px;
      border-radius: 0px 0px 6px 6px;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.node-title {
  gap: 8px;
  .img {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .create {
    background: #2ea1ff;
  }
  .dataBack {
    background: #4a60f1;
  }
}
</style>
