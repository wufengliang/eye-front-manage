/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-05 16:55:53
 * @LastEditTime: 2023-09-21 14:47:59
 * @Description: 用户管理
 */
import instance from './instance';

/**
 * @desc 获取用列表信息
 * @param data 传参主体
 */
export function getUserList(data: unknown) {
  return instance.post(`/api/admin/user/get?status=1`, data);
}

/**
 * @desc 删除用户
 * @param {String} userId 用户ID
 */
export function deleteUser(userId: string) {
  return instance.delete(`/api/admin/user/delete?userId=${userId}`);
}

/**
 * @param {Number} role 1 代表超级管理员 0 代表管理员
 * @desc 创建用户
 */
export function createUser(role: number, data: unknown) {
  return instance.post(`/api/admin/user/create?isAdmin=${role}`, data);
}

/**
 * @desc 更新用户
 */
export function updateUser(data: unknown) {
  return instance.put(`/api/admin/user/update`, data);
}
