import type { RequestOptions } from '@/utils/request'
import { request } from '@/utils/request'
/** 分页查询列表 */
export async function getList(body: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/page/custom', {
    method: 'POST',
    data: body,
    ...(options || { }),
  })
}
/** 新增 */
export async function add(body: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/save/custom', {
    method: 'POST',
    data: body,
    ...(options || { successMsg: '新增成功' }),
  })
}
/** 编辑 */
export async function edit(body: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/update', {
    method: 'POST',
    data: body,
    ...(options || { successMsg: '编辑成功' }),
  })
}
/** 删除 */
export async function del(params: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/delete', {
    method: 'DELETE',
    params,
    ...(options || { successMsg: '删除成功' }),
  })
}
/**
 *詳情
 */
export async function detail(params: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/detail', {
    method: 'GET',
    params,
    ...(options || { }),
  })
}
/**
 * 根据任务单ID查询任务单流程列表
 */

export async function getProcessDetail(params: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/task-order-processes', {
    method: 'GET',
    params,
    ...(options || { }),
  })
}

// 根据任务单ID查询配置文件列表

export async function getFiles(params: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/config-files', {
    method: 'GET',
    params,
    ...(options || { }),
  })
}
/**
 * 根据任务单ID查询数据回传详情列表
 */
export async function getReturnDetails(params: Record<string, any>, options?: RequestOptions) {
  return request<any>('/api/task-orders/data-return-details', {
    method: 'GET',
    params,
    ...(options || { }),
  })
}
