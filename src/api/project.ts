/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 11:34:55
 * @LastEditTime: 2023-09-13 11:42:54
 * @Description:
 */
import instance from './instance';

/**
 * @desc 获取项目列表
 */
export function getProjectList(data: unknown) {
  return instance.post(`/api/survey/get?status=1`, data);
}
