/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-09-13 17:32:02
 * @Description:
 */
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initCurrentUser } from '@/store/slices/user';
import Login from '@/views/login';
import Home from '@/views/home';
import Download from '@/views/download';
import Project from '@/views/project';
import User from '@/views/user';
import TestVideo from '@/views/test-video';
import CheckVideo from '@/views/check-video';
import DownloadVideo from '@/views/download-video';
import PhoneType from '@/views/phone-type';
import QuestionAnswer from '@/views/question-answer';
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
          <Route index path='/testVideo' element={<TestVideo />} />
          <Route index path='/checkVideo' element={<CheckVideo />} />
          <Route index path='/downloadVideo' element={<DownloadVideo />} />
          <Route index path='/phoneType' element={<PhoneType />} />
          <Route index path='/questionAnswer' element={<QuestionAnswer />} />
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/download' element={<Download />} />
      </Routes>
    </Router>
  );
}

