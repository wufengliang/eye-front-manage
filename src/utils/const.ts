/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 17:44:36
 * @LastEditTime: 2023-09-08 17:45:08
 * @Description: 常量数据
 */
import { IUserAuthType } from "@/types/common.type";

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
]
