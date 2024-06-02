/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:19:33
 * @LastEditTime: 2024-06-02 16:25:58
 * @Description: 界面布局
 */
import { useState, useEffect, useMemo } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, Dropdown, Space, message } from 'antd';
import { useNavigate, Outlet, useLocation, } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/user';
import { ADMIN_MENUS, SUPER_ADMIN_MENUS, commonRoutes, routerMap } from './params';
import { checkHasLogin, to } from '@/utils/utils';
import SystemLogo from './system-logo';
import AvatorJPG from '@/assets/images/header/avator.jpg';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '@/utils/variable';
import { Storage } from '@/utils/storage';
import './index.scss';
import { getListRole } from '@/api/role';
import { setRoleList as setRoleListMapData, setMenuList } from '@/store/role';
import { treeData } from '@/views/role/params';

const { Header, Sider, Content } = Layout;

function LayoutBox() {
  const reactLocation = useLocation();
  const { userInfo } = useSelector((state: Record<string, any>) => state.user);
  const { roleListMap } = useSelector((state: Record<string, any>) => state.role);
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState<string[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roleList = useMemo(() => {
    return (userInfo.role && roleListMap ? treeData((roleListMap[userInfo.role]?.permissionList || [])).map((i: any) => {
      return routerMap[i.title];
    }) : []);
  }, [userInfo?.role, roleListMap])

  useEffect(() => {
    if (roleList) {
      // console.log('roleList:', roleList);
      dispatch(setMenuList(roleList))
    }
  }, [roleList]);

  useEffect(() => {
    const pathname = reactLocation.pathname;
    const whitePaths = ['/', '/login', '/download', '/previewAnswer', '/projectDetail', '/projectEdit', '/answerUser'];

    // setTimeout(() => {
    //   if (!whitePaths.some(i => pathname.startsWith(i)) ||
    //     [...roleList].filter(item => item.path.startsWith(pathname)).length === 0
    //   ) {
    //     navigate('/404');
    //   } else {
    //     setKey([pathname.slice(1)]);
    //   }
    // }, 1500)

    setKey([pathname.slice(1)]);
  }, [reactLocation.pathname, roleList])

  useEffect(() => {
    const token = checkHasLogin();
    if (!token) {
      navigate('/login');
    } else {
      getRoleList();
    }
  }, []);

  useEffect(() => {
    if (userInfo?.role && roleListMap && roleListMap[userInfo.role]) {
      // const leftMenuList = treeData(roleListMap[userInfo.role]?.permissionList).map(i => {
      //   return {
      //     key: i.path.slice(1),
      //     label: i.title,
      //     icon: i.icon
      //   }
      // });
      // console.log(leftMenuList);
      // setMenus(leftMenuList);
    }
    setMenus(userInfo?.role === 1 ? SUPER_ADMIN_MENUS : ADMIN_MENUS);
  }, [userInfo?.role, roleListMap])


  /**
   * 获取用户列表
   */
  const getRoleList = async () => {
    const [, result] = await to(getListRole());
    if (result) {
      const map = result.reduce((prev: any, next: any) => {
        prev[next.id] = next;
        return prev;
      }, {});

      dispatch(setRoleListMapData(map))
    }
  }

  /**
   * @desc 点击菜单
   */
  const onClickMenuItem = (info: { item: Record<string, any>, key: string, keyPath: string[] }) => {
    const { key: _key } = info;
    if (_key !== key[0]) {
      setKey([_key]);
      navigate(_key);
    }
  }

  /**
   * @desc 退出
   */
  const logout = () => {
    Cookies.remove(USER_TOKEN);
    Storage.removeAll();
    dispatch(setCurrentUser({}));
    message.success('退出系统');
    navigate('/login', { replace: true });
  }

  return <Layout className='h-full flex flex-row'>
    <Sider trigger={null} collapsible collapsed={collapsed} className='flex-1'>
      <div className="logo-box flex justify-center">
        <div className='flex justify-center items-center'>
          <SystemLogo isOpen={!collapsed} color='#2c61e2' />
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={key}
        items={menus}
        onClick={(info) => onClickMenuItem(info)}
      />
    </Sider>
    <Layout className='flex-1 flex h-full'>
      <Header className='p-0 bg-white flex justify-between shadow-md z-10'>
        <Button
          className='!w-16 h-16 text-base'
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}

        />
        <div className='mr-4 flex items-center'>
          <span className='text-blue-500'>{userInfo?.username}</span>
          <Dropdown menu={{
            items: [{
              key: '', label: (
                <span onClick={() => logout()}>
                  <LogoutOutlined className='margin-right-5' />
                  退出
                </span>
              )
            }]
          }}>
            <div className='flex items-center'>
              <Avatar src={AvatorJPG} style={{ backgroundColor: '#1677ff' }} size={40} className='mr-1 ml-2' />
              <a href='javascript' onClick={(e) => e.preventDefault()}>
                <Space>
                  <DownOutlined />
                </Space>
              </a>
            </div>
          </Dropdown>
        </div>
      </Header>
      <div className='overflow-auto flex-1'>
        <Content
          className='mx-4 my-6 p-6 bg-white flex-1'
        >
          <Outlet />
        </Content>
      </div>
    </Layout>
  </Layout>
}

export default LayoutBox;
