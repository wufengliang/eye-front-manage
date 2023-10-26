/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-26 14:42:27
 * @LastEditTime: 2023-10-26 14:43:01
 * @Description: 上传App版本
 */
import instance from './instance';

//  上传App版本
export function uploadFile(data: unknown) {
  return instance.post(`/api/appRelease/add`, data);
}
