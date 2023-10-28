/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-10-28 16:45:08
 * @Description: 路由注册
 */
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initCurrentUser } from '@/store/slices/user';
import Login from '@/views/login';
import LayoutBox from '@/layout';
import Download from '@/views/download';
import Project from '@/views/project';
import User from '@/views/user';
import TestVideo from '@/views/test-video';
import CheckVideo from '@/views/check-video';
import DownloadVideo from '@/views/download-video';
import PhoneType from '@/views/phone-type';
import QuestionAnswer from '@/views/question-answer';
import Upload from '@/views/upload';
import QuestionDownload from '@/views/question-download';
import ProjectDetail from '@/views/project-detail';
import AnswerUser from '@/views/answer-user';
import ProjectEdit from '@/views/project-edit';
import VideoStatistic from '@/views/video-statistic';
import PreviewAnswer from '@/views/preview-answer';

export default function App() {

  const dispatch = useDispatch();
  console.log(process.env.PUBLIC_URL);
  useEffect(() => {
    dispatch(initCurrentUser());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LayoutBox />}>
          <Route index element={<Navigate to={'/user'} />} />
          <Route path='/user' element={<User />} />
          <Route path='/project' element={<Project />} />
          <Route path='/projectDetail/:id' element={<ProjectDetail />} />
          <Route path='/testVideo' element={<TestVideo />} />
          <Route path='/checkVideo' element={<CheckVideo />} />
          <Route path='/downloadVideo' element={<DownloadVideo />} />
          <Route path='/phoneType' element={<PhoneType />} />
          <Route path='/questionAnswer' element={<QuestionAnswer />} />
          <Route path='/answerUser' element={<AnswerUser />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/questionDownload' element={<QuestionDownload />} />
          <Route path='/videoStatistic' element={<VideoStatistic />} />
          <Route path='/previewAnswer' element={<PreviewAnswer />} />
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/download' element={<Download />} />
        <Route path='/projectEdit/:id' element={<ProjectEdit />} />
      </Routes>
    </Router>
  );
}

