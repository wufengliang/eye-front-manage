/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 09:43:04
 * @LastEditTime: 2023-10-23 09:52:20
 * @Description:
 */
import instance from './instance';

/**
 * @desc 导出问卷
 */
export function exportSurverData(data: unknown) {
  return instance.post(`/api/answer/userAnswerExport`, data, { responseType: "blob" });
}

/**
 * @desc 问卷调查列表
 */
export function getSurveyListData(data: unknown) {
  return instance.post(`/api/answer/userAnswerList`, data);
}
