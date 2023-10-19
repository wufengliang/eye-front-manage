/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-18 11:29:24
 * @LastEditTime: 2023-10-18 11:30:34
 * @Description: 返回
 */
import { useNavigate } from 'react-router-dom';

function CustomBack() {
  const navigate = useNavigate();
  return (
    <div className="header sticky top-10">
      <a className='cursor-pointer' onClick={() => navigate(-1)}>&lt; 返回</a>
    </div>
  )
}

export default CustomBack;
