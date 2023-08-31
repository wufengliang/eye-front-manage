/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-08-31 16:36:28
 * @Description: 
 */
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/login';
import Home from './views/home';
import Project from './views/project';
import './App.scss';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route index element={<Navigate to={'/user'} />} />
          <Route path='/user' element={<Project />} />
        </Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

