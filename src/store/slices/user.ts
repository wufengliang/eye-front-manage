/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-04 14:12:40
 * @LastEditTime: 2023-09-04 15:30:44
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';
import { Storage } from '@/utils/storage';
import { USER_INFO } from '@/utils/variable';

const initState = {
  userInfo: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.userInfo = action.payload;
    },
    initCurrentUser: (state) => {
      const value = Storage.getItem(USER_INFO);
      state.userInfo = value || {};
    }
  }
})

export const { setCurrentUser, initCurrentUser } = userSlice.actions;
export default userSlice.reducer;
