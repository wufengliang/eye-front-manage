/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:56
 * @LastEditTime: 2023-09-13 16:42:50
 * @Description: 校准视频
 */
import instance from './instance';

/**
 * @desc 获取校准视频
 */
export function getCheckVideoList(data: unknown) {
  return instance.post(`/api/answer/getPreVideo`, data);
}
