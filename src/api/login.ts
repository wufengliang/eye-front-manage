/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-31 15:06:36
 * @LastEditTime: 2023-08-31 15:35:38
 * @Description: 
 */
import instance from './instance';

/**
 * @desc 获取图片验证码
 */
export function getCheckImgCode() {
    return instance.get(`/api/user/code`);
}

/**
 * @desc 登录
 */
export function loginIn(data: Record<string, any>) {
    return instance.post(`/api/user/login`, data);
}