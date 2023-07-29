/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-07-29 16:26:17
 * @Description: 
 */
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Login from './views/login';
import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
