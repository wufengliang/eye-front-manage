/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:19:33
 * @LastEditTime: 2023-07-29 22:33:09
 * @Description: 界面布局
 */
import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SUPER_ADMIN_MENUS } from './params';
import SystemLogo from './system-logo';
import './index.scss';

const { Header, Sider, Content } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [keys, setKyes] = useState([SUPER_ADMIN_MENUS[0].key]);
  const navigate = useNavigate();

  const onClickMenuItem = (info: { item: Record<string, any>, key: string, keyPath: string[] }) => {
    const { key } = info;
    if (key !== keys[0]) {
      navigate(key);
    }
  }

  return <Layout className='h-full'>
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo-box flex justify-center">
        <div className='flex justify-center items-center'>
          <SystemLogo isOpen={!collapsed} color='#2c61e2' />
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={keys}
        items={SUPER_ADMIN_MENUS as any[]}
        onClick={(info) => onClickMenuItem(info)}
      />
    </Sider>
    <Layout>
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
        Content
      </Content>
    </Layout>
  </Layout>
}

export default Home;