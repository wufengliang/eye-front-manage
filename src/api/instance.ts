/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-31 14:50:25
 * @LastEditTime: 2023-10-07 19:37:01
 * @Description: 拦截器
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '@/utils/variable';
import { login } from '@/utils/utils';
import { notification } from 'antd';

const { REACT_APP_BASE_URL: baseURL } = process.env;

//  过滤的url
const ignoreListUrl = [
  '/api/user/code',   //  图片验证码
  '/api/user/login',  //  登录
  '/api/appRelease/download', //  获取下载app信息
];

const instance = axios.create({ baseURL, timeout: 15000 });

instance.defaults.withCredentials = false;

instance.interceptors.request.use(config => {
  const token = Cookies.get(USER_TOKEN);
  if (token && !ignoreListUrl.includes(config.url!)) {
    config.headers.Authorization = token;
  }
  return config;
});

instance.interceptors.response.use(response => {
  const { code, message, data: result } = response.data;
  switch (response.status) {
    case 200:
      if ([403, 404, 500].includes(code)) {
        notification.error({ message: '提示', description: message || '接口异常', duration: 2 });
        return Promise.reject(response);
      }

      if ([4005].includes(code)) {
        notification.error({ message: '提示', description: message, duration: 2 });
        return login();
      }

      if (code === 200) {
        return result;
      }
      return response;
    case 401:
      login();
      return response;
    default:
      return response;
  }
});

export default instance;
