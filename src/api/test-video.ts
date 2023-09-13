/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:14:07
 * @LastEditTime: 2023-09-13 16:14:54
 * @Description: 测试视频
 */
import instance from './instance';

/**
 * @desc 获取测试视频
 */
export function getTestVideoList(data: unknown) {
  return instance.post(`/api/answer/getVideo`, data);
}
