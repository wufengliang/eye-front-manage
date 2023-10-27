/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 17:44:36
 * @LastEditTime: 2023-10-27 16:42:08
 * @Description: 常量数据
 */
import { IUserAuthType } from "@/types/common.type";

//  用户身份
export const USER_TYPE_LIST: Array<IUserAuthType> = [
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
export const QUESTTION_TYPE_LIST = ['筛选题', '单选题', '多选题', '排序题', '评分题', '问答题', '矩阵题'];

//  题目控件
export const QUESTTION_ICON_LIST = [
  {
    value: 0,
    label: '筛选题',
    iconName: 'icon-shaixuantiku',
  },
  {
    value: 1,
    label: '单选题',
    iconName: 'icon-danxuanti',
  },
  {
    value: 2,
    label: '多选题',
    iconName: 'icon-duoxuanti',
  },
  {
    value: 3,
    label: '排序题',
    iconName: 'icon-icon-',
  },
  {
    value: 4,
    label: '评分题',
    iconName: 'icon-zuoce-qujian',
  },
  {
    value: 5,
    label: '问答题',
    iconName: 'icon-pingfen',
  },
  {
    value: 6,
    label: '矩阵题',
    iconName: 'icon-icon_juzhentiankong',
  },
]

//  测试文件类型
export const TEST_FILES_TYPE_LIST = [
  { label: '图片', value: 1, accept: 'image/*' },
  { label: '视频', value: 2, accept: 'video/*' },
  { label: '音频', value: 3, accept: 'audio/*' },
  { label: '无', value: 4 },
]

export const yearSeconds = 3600 * 24 * 365;
