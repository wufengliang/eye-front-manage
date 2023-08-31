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
            switch (code) {
                case 200:
                    return result;
                case 4000:
                    notification.error({ message: '提示', description: message, duration: 2 });
                    return Promise.reject(response);
                case 4005:
                    return login();
                default:
                    return response;
            }
        case 401:
            login();
            return response;
        default:
            return response;
    }
});

export default instance;