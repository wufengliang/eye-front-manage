/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:19:33
 * @LastEditTime: 2023-08-31 16:21:27
 * @Description: 界面布局
 */
import { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SUPER_ADMIN_MENUS } from './params';
import SystemLogo from './system-logo';
import './index.scss';
import { checkHasLogin } from '@/utils/utils';

const { Header, Sider, Content } = Layout;

function Home() {
  const reactLocation = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState([reactLocation.pathname.substring(1)]);
  const navigate = useNavigate();

  const token = checkHasLogin();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);

  const onClickMenuItem = (info: { item: Record<string, any>, key: string, keyPath: string[] }) => {
    const { key: _key } = info;
    if (_key !== key[0]) {
      setKey([_key]);
      navigate(_key);
    }
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
          <span>个人信息</span>
          <Dropdown menu={{ items: [{ key: '', label: '退出', icon: <LogoutOutlined /> }] }}>
            <div className='flex items-center'>
              <Avatar src={''} size={40} className='mr-1 ml-2' />
              <a className='text-blue-500' href='javascript' onClick={(e) => e.preventDefault()}>
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