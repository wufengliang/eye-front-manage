/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 17:44:36
 * @LastEditTime: 2023-10-17 15:05:16
 * @Description: 常量数据
 */
import { IUserAuthType } from "@/types/common.type";

//  用户身份
export const UserTypeList: Array<IUserAuthType> = [
  {
    value: 1,
    label: "超级管理员",
  },
  {
    value: 2,
    label: "项目管理员",
  },
  {
    value: 3,
    label: "普通用户",
  },
];

//  项目题目
export const QuestionTypeList = ['筛选题', '单选题', '多选题', '排序题', '评分题', '问答题', '矩阵题'];
