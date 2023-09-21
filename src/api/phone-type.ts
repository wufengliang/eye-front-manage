/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 17:12:52
 * @LastEditTime: 2023-09-21 11:49:03
 * @Description:
 */
import instance from './instance';

/**
 * @desc 获取手机型号数据
 */
export function getPhoneTypeList(data: unknown) {
  return instance.post(`/api/phone/getAll`, data);
}

/**
 * @desc 创建新的手机型号
 */
export function createNewPhoneType(data: unknown) {
  return instance.put(`/api/phone/add`, data)
}

/**
 * @desc 更新新的手机型号
 */
export function updateNewPhoneType(data: unknown) {
  return instance.post(`/api/phone/update`, data);
}

/**
 * @desc 删除手机型号
 */
export function deleteNewPhoneType(id: string | number) {
  return instance.delete(`/api/phone/delete?id=${id}`);
}
