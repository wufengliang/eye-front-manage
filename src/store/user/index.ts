/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-04 14:12:40
 * @LastEditTime: 2024-06-02 21:53:10
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';
import { Storage } from '@/utils/storage';
import { USER_INFO } from '@/utils/variable';
import { treeData } from '@/views/role/params';

const initState = {
  userInfo: {} as Record<string,any>,
  menuList:[] as any[],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.userInfo = action.payload;
      state.menuList = treeData(action.payload?.permissionList || []);
    },
    initCurrentUser: (state) => {
      const value = Storage.getItem(USER_INFO);
      state.userInfo = value || {};
      state.menuList = treeData(value?.permissionList || []);
    }
  }
})

export const { setCurrentUser, initCurrentUser } = userSlice.actions;
export default userSlice.reducer;
