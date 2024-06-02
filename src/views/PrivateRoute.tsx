/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-31 11:18:20
 * @LastEditTime: 2024-06-02 21:48:13
 * @Description:
 */
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';

interface IProps {
  path: string
  children?: ReactNode;
}

const PrivateRoute = (props: IProps) => {
  const reactLocation = useLocation();
  const navigate = useNavigate();
  const { menuList } = useSelector((state: Record<string, any>) => state.user);

  useEffect(() => {
    if (reactLocation.pathname !== props.path) {
      navigate(menuList.length > 0 ? `/${menuList[0]?.key}` : '/', { replace: true });
    }
  }, [reactLocation.pathname, menuList]);

  return (
    <>
      {props.children}
    </>
  )
}

export default PrivateRoute;
