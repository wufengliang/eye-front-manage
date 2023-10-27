/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-18 11:29:24
 * @LastEditTime: 2023-10-27 17:56:00
 * @Description: 返回
 */
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

function CustomBack(props: Record<string, any> = {}) {
  const { bgClassName } = props;
  const navigate = useNavigate();
  return (
    <div className={classNames('header sticky top-10', bgClassName)}>
      <a className='cursor-pointer bg-white text-blue-500' onClick={() => navigate(-1)}>&lt; 返回</a>
    </div>
  )
}

export default CustomBack;
