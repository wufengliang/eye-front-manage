/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-09-08 17:19:55
 * @Description:
 */
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initCurrentUser } from '@/store/slices/user';
import Login from './views/login';
import Home from './views/home';
import Download from './views/download';
import Project from './views/project';
import User from './views/user';
import './App.scss';

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initCurrentUser());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route index element={<Navigate to={'/user'} />} />
          <Route index path='/user' element={<User />} />
          <Route index path='/project' element={<Project />} />
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/download' element={<Download />} />
      </Routes>
    </Router>
  );
}

