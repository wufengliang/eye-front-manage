/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 17:03:57
 * @LastEditTime: 2023-09-13 17:04:33
 * @Description:
 */
import instance from './instance';

/**
 * @desc 获取下载视频数据
 */
export function getDownloadVideoList(data: unknown) {
  return instance.post(`/api/survey/get?status=1`, data);
}
