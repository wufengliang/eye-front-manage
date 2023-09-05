/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:19:33
 * @LastEditTime: 2023-09-04 15:29:13
 * @Description: 界面布局
 */
import { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, Dropdown, Space, message } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/slices/user';
import { SUPER_ADMIN_MENUS } from './params';
import { checkHasLogin } from '@/utils/utils';
import SystemLogo from './system-logo';
import AvatorJPG from '@/assets/images/header/avator.jpg';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '@/utils/variable';
import { Storage } from '@/utils/storage';
import './index.scss';

const { Header, Sider, Content } = Layout;

function Home() {
  const reactLocation = useLocation();
  const userInfo = useSelector((state: Record<string, any>) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState([reactLocation.pathname.substring(1)]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = checkHasLogin();
    if (!token) {
      navigate('/login');
    }
  }, []);

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
        defaultSelectedKeys={key}
        items={SUPER_ADMIN_MENUS as any[]}
        onClick={(info) => onClickMenuItem(info)}
      />
    </Sider>
    <Layout className='flex-1'>
      <Header className='p-0 bg-white flex justify-between'>
        <Button
          className='!w-16 h-16 text-base'
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}

        />
        <div className='mr-4 flex items-center'>
          <span className='text-blue-500'>{userInfo?.userInfo?.username}</span>
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
      <Content
        className='mx-4 my-6 p-6 min-h-82.5 bg-white'
      >
        <Outlet />
      </Content>
    </Layout>
  </Layout>
}

export default Home;
