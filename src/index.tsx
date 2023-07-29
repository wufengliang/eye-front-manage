/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-07-29 20:57:09
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
reportWebVitals();
