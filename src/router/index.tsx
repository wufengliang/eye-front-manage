/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 17:49:18
 * @LastEditTime: 2023-09-13 18:02:26
 * @Description:
 */
import { Navigate } from 'react-router-dom';
import menus from './routerConfig';
import LayoutBox from '@/layout';

const routes = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <LayoutBox />, children: menus.filter(item => item.zIndex === 1).map(item => ({ path: `/${item.key}`, element: item.element })) },
  ...menus.filter(item => item.zIndex === 0).map(item => ({ path: `/${item.key}`, element: item.element })),
]

export default routes;
