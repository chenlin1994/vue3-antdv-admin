<script setup lang="ts">
import type { TableColumnType, TableProps } from 'ant-design-vue'
import type { RowSelectionType } from 'ant-design-vue/es/table/interface'
import { computed, reactive, ref } from 'vue'
import { useScrollY } from '@/hooks/useScrollY'

const props = withDefaults(
  defineProps<{
    /**
     * 表格为主页面
     */
    isPageView?: boolean
    /**
     * 表格标题
     */
    tableTitle?: string
    /**
     * 列
     */
    baseColumns: Array<TableColumnType>
    /**
     * 数据
     */
    dataSource: Array<Record<string, any>>
    /**
     * 选择类型
     */
    rowSelectionType?: string
    /**
     * 是否分页
     */
    showPagination?: boolean
    /**
     * 边框
     */
    bordered?: boolean
    /**
     * 以document高度计算table高度
     */
    subHeight?: number
    /**
     * 以table-body高度计算table高度
     */
    subHeight1?: number
    /**
     * 统一列宽
     */
    columnWidth?: number
    /**
     * 是否通过css的方式固定table-body的高度
     */
    cssFixed?: boolean
    /**
     * 选中项row-key 集合
     */
    selectedRowKeys?: Array<number | string>
    /**
     * 选中项集合
     */
    selectedRows?: Array<Record<string, any>>
    /**
     * y轴是否滚动
     */
    noScroll?: boolean
    /**
     *设置scroll.y
     */
    scrollYHeight?: number
    /**
     * 是否加表格条纹
     */
    striped?: boolean
    /**
     * 表格大小
     */
    size?: 'small' | 'middle' | 'large'
    /**
     * 选择框选择属性
     */
    rowKey?: string
    /**
     * 动态设置表格宽度
     */
    calcWidth?: number
    /**
     * 是否自定义表头样式
     */
    customizeHeaderCellStyle?: boolean
    /**
     * 不可选中数据
     */
    disabledChecked?: string[] | undefined
    /**
     * 拖拽排序
     */
    draggable?: boolean
    /**
     * 加载loading
     */
    loading?: boolean
    /**
     * 是否有选中效果
     */
    activeRow?: boolean
    /**
     * 是否默认展开所有行
     */
    defaultExpandAllRows?: boolean
    /**
     *展开行
     */
    expandedRowKeys?: string[]
    /**
     * 自定义index渲染
     */
    customIndexRender?: boolean
    /**
     * 表格最小高度
     */
    tableBodyMinHeight?: number
  }>(),
  {
    showPagination: true,
    bordered: true,
    rowSelectionType: 'checkbox',
    subHeight: 230,
    subHeight1: 80,
    isPageView: true,
    columnWidth: 140,
    cssFixed: false,
    noScroll: false,
    scrollYHeight: 0,
    striped: false,
    size: 'small',
    rowKey: 'id',
    calcWidth: 0,
    customizeHeaderCellStyle: false,
    disabledChecked: undefined,
    draggable: false,
    loading: false,
    activeRow: false,
    defaultExpandAllRows: false,
    expandedRowKeys: () => [],
    customIndexRender: false,
    tableBodyMinHeight: 0,
  },
)
const emit = defineEmits<{
  (e: 'load'): void
  (e: 'row-click', record: Record<string, any>, index: number): void
  (e: 'row-dbClick', record: Record<string, any>): void
  (e: 'expanded-rows-change'): void
  (e: 'change', params: Record<string, any>): void
  (e: 'columns-change'): void
  (e: 'update:selectedRowKeys', params: (string | number)[]): void
  (e: 'update:selectedRows', params: Array<Record<string, any>>): void
  (
    e: 'changeSort',
    params: {
      dragIndex: number
      targetIndex: number
      dragItem: Record<string, any>
      targItem: Record<string, any>
    }
  ): void
  (e: 'expandedRowsChange', params: string[]): void
  (e: 'onSelect', params: Record<string, any>): void
}>()
const activeRowId = ref<string | undefined>(undefined)
const selectedKeys = computed(() => props.selectedRowKeys)
const baseTable = ref()
const { computedTableHeight } = useScrollY(
  baseTable,
  props.scrollYHeight,
)
let dragItem: Record<string, any> = {}
let dragIndex: number
let targetIndex: number
let targItem: Record<string, any> = {}
const handleCustomRow = (
  record: Record<string, any>,
  index: number,
): {
  onClick: (event: MouseEvent, index: number) => void
  onDblclick: (event: MouseEvent) => void
  onMouseenter: (event?: MouseEvent) => void
  onDragstart: (event?: DragEvent) => void
  onDragover: (event?: DragEvent) => void
  onDrop: (event?: DragEvent) => void
  style: Record<string, any>
} => {
  return {
    style: {
      cursor: props.draggable ? 'move' : 'normal',
    },
    /**
     * 鼠标移入
     */
    onMouseenter: (event) => {
      // 兼容IE
      let ev = event || window.event
      if (ev && ev.target instanceof HTMLElement) {
        ev!.target!.draggable = props.draggable
      }
    },
    /**
     * 开始拖拽
     */
    onDragstart: (event) => {
      // 兼容IE
      let ev = event || window.event
      // 阻止冒泡
      ev!.stopPropagation()
      // 得到源目标数据
      dragItem = record
      dragIndex = index
    },
    /**
     * 拖动元素经过的元素
     */
    onDragover: (event) => {
      const ev = event || window.event
      ev?.preventDefault()
    },
    /**
     * 鼠标松开
     */
    onDrop: (event) => {
      const ev = event || window.event
      ev?.stopPropagation()
      targItem = record
      targetIndex = index
      emit('changeSort', { targItem, targetIndex, dragIndex, dragItem })
    },
    onClick: () => {
      activeRowId.value = record[props.rowKey]
      emit('row-click', record, index)
    }, /**
        * 点击行
        */
    onDblclick: () => {
      emit('row-dbClick', record)
    },
  }
}

// const selectedRowKeys = defineModel('selectedRowKeys', {
//   type: Array<number | string>
// })
// const selectedRows = defineModel('selectedRows', {
//   type: Array<Object>
// })
const columns = computed<TableColumnType[]>(() => {
  return props.baseColumns.map(item => ({
    ...item,
    align: item.align || 'center',
    width: item.width || props.columnWidth,
  }))
})
// 单选复选框配置
let rowSelection: TableProps['rowSelection'] = {
  fixed: true,
  type: (props.rowSelectionType || 'checkbox') as RowSelectionType,
  columnWidth: 60,
  selectedRowKeys: selectedKeys,
  getCheckboxProps: record => ({
    disabled:
      !record[props.rowKey]
      || (props.disabledChecked && props.disabledChecked.includes(record[props.rowKey])),
  }),
  onChange: (Keys: (string | number)[], Rows: Array<Record<string, any>>): void => {
    // selectedKeys.value = Keys
    // selectedRowKeys.value = Keys
    // selectedRows.value = Rows
    emit('update:selectedRowKeys', Keys)
    emit('update:selectedRows', Rows)
  },
  onSelect: (record, selected) => {
    emit('onSelect', { ...record, selected })
  },
}
// 分页配置
const pagination = reactive({
  // 当前页
  current: 1,
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  // 页面条数
  pageSize: 10,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  total: 0,
  onChange: (page: number, pageSize?: number) => {
    pagination.current = page
    pageSize && (pagination.pageSize = pageSize)
    emit('load')
  },
})
/**
 *删除某一行数据
 */
const delRow = (rowIndex: number) => {
  props.dataSource.splice(rowIndex, 1) // selectedKeys
}
const expandedRowsChange = (expandedRows: string[]) => {
  emit('expandedRowsChange', expandedRows)
}
defineExpose({ pagination, delRow, activeRowId })
</script>

<template>
  <div class="table-content" :style="isPageView ? { padding: '16px' } : {}">
    <div v-if="$slots.query" class="table-search">
      <slot name="query" />
    </div>
    <a-divider v-if="$slots.query" />
    <div
      v-if="$slots.tool || $slots.tableName"
      class="table-tool"
      :style="calcWidth ? { width: `${calcWidth}px` } : {}"
    >
      <div class="table-tool-left">
        <slot name="tableName" />
      </div>
      <div class="table-tool-right">
        <slot name="tool" />
      </div>
    </div>
    <div
      ref="baseTable"
      class="table-body"
      :class="[size, !customizeHeaderCellStyle ? 'table-normal' : '']"
      :style="[
        calcWidth ? { width: `${calcWidth}px` } : {},
        { 'min-height': `${tableBodyMinHeight}px` },
      ]"
    >
      <a-table
        :row-selection="rowSelectionType ? rowSelection : undefined"
        :columns="columns"
        :data-source="dataSource"
        :bordered="bordered"
        :pagination="showPagination ? pagination : false"
        :row-class-name="
          (_record: Record<string, any>, index: number) =>
            [
              index % 2 === 1 && striped ? 'table-striped' : undefined,
              activeRow ? (activeRowId == _record[rowKey] ? 'active-row' : undefined) : undefined,
            ]
              .filter(Boolean)
              .join(',')
        "
        :size="size"
        :row-key="rowKey"
        :custom-row="handleCustomRow"
        :scroll="noScroll ? { x: '100%' } : { x: '100%', y: computedTableHeight }"
        :loading="loading"
        :default-expand-all-rows="defaultExpandAllRows"
        :expanded-row-keys="expandedRowKeys"
        @expanded-rows-change="expandedRowsChange"
        @change="
          (
            pagination: Record<string, any>,
            filters: Record<string, any>,
            sorter: Record<string, any>,
          ) => emit('change', { pagination, filters, sorter })
        "
      >
        <template #headerCell="{ column, title }">
          <slot name="cellHeader" :column="column" :title="title">
            <span class="table-header-cell">{{ title }}</span>
          </slot>
        </template>
        <template #bodyCell="{ column, record, index, text }">
          <template v-for="item in Object.keys($slots)" :key="item">
            <slot
              v-if="column.dataIndex === item"
              :name="item"
              v-bind="{ column, record, index, text }"
            />
          </template>
          <template v-if="column.dataIndex === 'index' && !customIndexRender">
            {{
              showPagination ? (pagination.current - 1) * pagination.pageSize + index + 1 : index + 1
            }}
          </template>
          <template v-else-if="$slots.customBodyCell">
            <slot name="customBodyCell" v-bind="{ column, record, index, text }" />
          </template>
        </template>
        <template v-if="$slots.tableFooter" #footer>
          <slot name="tableFooter" />
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-search {
    margin-bottom: 10px;
  }
  .table-tool {
    display: flex;
    margin: 10px 0;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    .table-tool-left {
      text-align: left;
      font-family: AlibabaPuHuiTi;
      font-size: 16px;
      font-weight: normal;
      line-height: 22px;
      color: #1c2126;
    }
    .table-tool-right {
      text-align: right;
    }
  }
  .table-body {
    flex: 1;
    max-width: 100%;
  }
}
:deep(.ant-row) {
  width: 100%;
}
:deep(.table-striped) td {
  background: #e7ebf5;
}

:deep(.ant-table-tbody) {
  & > tr.ant-table-row-selected > td {
    background: #e7ebf6;
  }
}
:deep(.ant-pagination-item-link) {
  padding: 0;
}
:deep(.ant-table-pagination.ant-pagination) {
  margin-bottom: 0;
}
:deep(.ant-table-cell-row-hover) {
  background: #e7ebf5 !important;
}
:deep(.active-row) {
  background: #e7ebf5 !important;
}
:deep(.ant-table-cell) {
  height: 32px;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
:deep(.ant-table-header) {
  .ant-table-cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .table-header-cell {
    padding-left: 8px;
    padding-right: 8px;
  }
}
:deep(.ant-table-expanded-row-fixed) {
  height: 100%;
}
.table-normal {
  :deep(.ant-table) {
    .ant-table-thead {
      .ant-table-cell {
        background: var(--background-color-gray);
      }
    }
  }
}
:deep(.ant-divider-horizontal) {
  margin: 10px 0;
}
:deep(.ant-empty-normal) {
  margin: 0;
}
</style>
