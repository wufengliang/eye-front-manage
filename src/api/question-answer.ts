/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 17:29:55
 * @LastEditTime: 2023-09-13 17:30:57
 * @Description: 问卷答案
 */
import instance from './instance';

/**
 * @desc 获取问卷答案
 */
export function getQuestionAnswerList(data: unknown) {
  return instance.post(`/api/survey/get?status=1`, data);
}
