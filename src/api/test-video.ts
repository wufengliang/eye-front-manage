/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:14:07
 * @LastEditTime: 2023-09-19 16:39:34
 * @Description: 测试视频
 */
import instance from './instance';

/**
 * @desc 获取测试视频
 */
export function getTestVideoList(data: unknown) {
  return instance.post(`/api/answer/getVideo`, data);
}

/**
 * @desc 查看热力图
 */
export function getHotPicture(id: string) {
  return instance.get(`/api/viewTrace/getHeatmapImage?videoId=${id}`);
}

/**
 * @desc 查看轨迹图
 * @param {Array<number>} videoIds 轨迹图id集合
 */
export function getTrajectoryData(videoIds: number[]) {
  return instance.post(`/api/viewTrace/batchGetEyeTrackData`, { data: { videoIds } });
}

/**
 * @desc 下载动态热力图
 */
export function getDynamicHotData(videoId: string) {
  return instance.get(`/api/viewTrace/getHeatmapImage?videoId=${videoId}`);
}
