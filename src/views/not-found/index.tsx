/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-31 11:44:57
 * @LastEditTime: 2024-05-31 11:57:59
 * @Description:
 */
import { useSelector } from "react-redux";
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMemo } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const { menuList } = useSelector((state: Record<string, any>) => state.role);

  const path = useMemo(() => {
    if (!menuList || !menuList.length) {
      return '/'
    } else {
      return menuList[0].path;
    }
  }, [menuList]);

  return (
    <Result
      status="warning"
      title="您没有访问权限，请联系管理员操作"
      extra={
        <Button type="primary" key="console" onClick={() => navigate(path)}>
          去首页
        </Button>
      }
    />
  )
}

export default NotFound
