/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 17:03:57
 * @LastEditTime: 2023-10-19 11:26:18
 * @Description:
 */
import instance from './instance';

/**
 * @desc 获取下载视频数据
 */
export function getDownloadVideoList(data: unknown) {
  return instance.post(`/api/survey/get?status=1`, data);
}

/**
 * @desc 下载测试视频
 */
export function downloadTestVideo(data: unknown) {
  return instance.get(`/api/super/download/test-video`, { params: data });
}


/**
 * @desc 下载校准视频
 */
export function donwloadCheckVideo(data: unknown) {
  return instance.get(`/api/super/download/pre-video`, { params: data });
}
