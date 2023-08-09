/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-09 11:26:55
 * @LastEditTime: 2023-08-09 11:29:53
 * @Description: 
 */
import { Route } from 'react-router-dom';
import ProjectPage from "@/views/project";

export default () => {
  return (
    <>
      <Route path='/project' Component={ProjectPage} />
    </>
  )
}