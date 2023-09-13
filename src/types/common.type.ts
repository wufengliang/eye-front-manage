/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 11:49:57
 * @LastEditTime: 2023-09-13 11:27:05
 * @Description: 公共类型
 */

//  通用表格类型
export interface IResult<T> {
  total: number;
  list: T[]
}

export type TNumberOrString = string | number;

export interface IUserAuthType {
  value: number;
  label: string;
}

export interface IColumnType {
  title: string;
  dataIndex: string;
  fixed?: string;
  width: number;
}
