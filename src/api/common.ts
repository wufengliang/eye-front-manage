/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-23 10:20:24
 * @LastEditTime: 2023-10-26 14:58:54
 * @Description: 公共调用接口
 */
import { IUploadType } from '@/types/common.type';
import instance from './instance';
import { to } from '@/utils/utils';
import { omit } from 'lodash-es';

/**
 * @desc 获取文件的数据，包含url
 * @param field 文件id
 * @param expireTime 过期时间
 */
export function getImgFileUrl(field: string, expireTime = 10000) {
  return instance.get(`/api/file/download?expireTime=${expireTime}&fileId=${field}`);
}

/**
 * @desc 上传文件
 */
export async function uploadFile(data: IUploadType) {
  const [error, result] = await to(instance.post(`/api/file/upload`, { ...omit(data, 'file') }));
  if (result) {
    const { requestId, uploadLink } = result;
    await instance.put(uploadLink, data.file, { headers: { "Content-Type": data.contentType } });
    const [error1, value] = await to(instance.get(`/api/file/confirm?requestId=${requestId}`));

    if (value) {
      const [, res] = await to(instance.get(`/api/file/download?expireTime=${data.expireTime}&fileId=${value}`));
      return res ? res : null;
    }
    return [error1];
  }
  return [error];
}

/**
 * @desc 根据图片获取用户的分辨率
 * @param {String} session session字段
 */
export function getScreenInfo(session: string) {
  return instance.get(`/api/answer/getClientScreen?session=${session}`);
}
