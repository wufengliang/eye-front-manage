/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-31 11:22:25
 * @LastEditTime: 2023-09-04 15:01:33
 * @Description:
 */
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    user: userReducer,
  }
})
