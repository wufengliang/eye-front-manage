/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-05 15:54:25
 * @LastEditTime: 2023-09-05 15:55:44
 * @Description: 下载相关api
 */
import instance from './instance';

/**
 * @desc 获取app的下载信息
 */
export function getReleaseAppInfo() {
  return instance.get(`/api/appRelease/download`);
}
