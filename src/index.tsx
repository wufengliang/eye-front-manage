/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-08-31 16:27:51
 * @Description: 
 */
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
reportWebVitals();
