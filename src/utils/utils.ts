/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-30 10:51:39
 * @LastEditTime: 2023-09-13 09:38:36
 * @Description:
 */
import Cookies from 'js-cookie';
import { USER_TOKEN } from '@/utils/variable';

/**
 * @returns 返回当前token信息
 */
export const checkHasLogin = () => {
  return Cookies.get(USER_TOKEN);
}

/**
 * @desc 去登录
 */
export const login = () => {
  const { protocol, origin } = window.location;
  Cookies.remove(USER_TOKEN);
  window.location.href = `${protocol}://${origin}/login`;
}

/**
 * @desc to-js
 */
export async function to(p: Promise<any>): Promise<Array<any>> {
  try {
    const value = await p;
    return [null, value];
  } catch (err) {
    return [err, null];
  }
}
