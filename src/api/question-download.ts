/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 09:43:04
 * @LastEditTime: 2023-10-17 09:49:41
 * @Description:
 */
import instance from './instance';

/**
 * @desc 导出问卷
 */
export function exportSurverData(data: unknown) {
  return instance.post(`/answer/userAnswerExport`, data, { responseType: "blob" });
}
