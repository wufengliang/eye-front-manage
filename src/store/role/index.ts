/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-04 14:12:40
 * @LastEditTime: 2024-05-30 21:19:36
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';

const initState = {
  roleListMap: {},
  menuList:[],
}

export const roleSlices= createSlice({
  name: 'role',
  initialState: initState,
  reducers: {
    setRoleList:(state,action)=>{
      state.roleListMap = action.payload;
    },
    setMenuList:(state,action)=>{
      state.menuList = action.payload;
    }
  }
})

export const { setRoleList,setMenuList } = roleSlices.actions;
export default roleSlices.reducer;
