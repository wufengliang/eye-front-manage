/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-29 23:01:54
 * @LastEditTime: 2024-05-29 23:06:15
 * @Description:
 */
import instance from './instance';

/**
 * 添加/更新角色
 */
export function saveOrUpdateRole(data: unknown) {
  return instance.post(`/api/role/saveRole`, data);
}

/**
 * 获取所有权限列表
 */
export function getAllPermissionRoleList() {
  return instance.get(`/api/role/listAllPermission`);
}

/**
 * 删除角色
 */
export function deleteRole(id: string | number) {
  return instance.post(`/api/role/deleteRole`, { id })
}


/**
 * 获取角色列表(包含授权列表)
 */
export function getListRole(){
  return instance.get(`/api/role/listRole`);
}
