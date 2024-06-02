/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-30 17:02:30
 * @LastEditTime: 2024-05-31 14:03:05
 * @Description:
 */
import { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";

interface IProps {
  id?: number | string;
  children?: any;
  check?: boolean;
}

function CustomShowContainer(props: IProps) {
  const { roleListMap = {} } = useSelector((state: Record<string, any>) => state.role);
  const { userInfo = {} } = useSelector((state: Record<string, any>) => state.user);

  const permissionListMap = useMemo(() => {
    return roleListMap[userInfo.role]?.permissionList.reduce((prev: any, next: any) => {
      prev[next.id] = true;
      return prev;
    }, {})
  }, [userInfo, roleListMap])

  const renderNode = () => {
    const { check = true } = props;

    if (!check) {
      return props.children;
    }

    return props.id ? (permissionListMap?.[props.id] ? props.children : null) : props.children;
  }

  return renderNode();
}

export default CustomShowContainer;
