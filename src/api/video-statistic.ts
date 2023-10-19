import instance from './instance';

/**
 * @desc 获取视频统计
 */
export function getTotalVideoStatistic(data?: unknown) {
  return instance.get(`/api/answer/statistics`, { params: data });
}
