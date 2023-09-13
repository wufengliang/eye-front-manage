import instance from './instance';

/**
 * @desc 获取手机型号数据
 */
export function getPhoneTypeList(data: unknown) {
  return instance.post(`/api/phone/getAll`, data);
}
