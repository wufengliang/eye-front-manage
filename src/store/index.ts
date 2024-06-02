/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-31 11:22:25
 * @LastEditTime: 2024-05-31 13:44:17
 * @Description:
 */
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import roleReducer from './role'

export const store = configureStore({
  reducer: {
    user: userReducer,
    role:roleReducer,
  },
  middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({serializableCheck:false})
  },
})
