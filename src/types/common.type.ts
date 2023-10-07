/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 11:49:57
 * @LastEditTime: 2023-09-23 12:03:49
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

/**
 * @desc 上传通用类型
 */
export interface IUploadType {
  contentType: string;
  expireTime: number;
  fileName: string;
  urlPath: string;
}
