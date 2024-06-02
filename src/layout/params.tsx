/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:44:59
 * @LastEditTime: 2024-05-31 10:50:59
 * @Description:
 */
import {
  UsergroupAddOutlined,
  ProjectOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  DownloadOutlined,
  PieChartOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  CloudUploadOutlined,
  CloudServerOutlined,
  BgColorsOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

import Login from '@/views/login';
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
import PermissionBox from '@/views/role';

//  超级管理员
export const SUPER_ADMIN_MENUS: Array<Record<string, any>> = [
  { key: 'user', label: '用户管理', icon: <UsergroupAddOutlined /> },
  { key: 'project', label: '项目管理', icon: <ProjectOutlined /> },
  { key: 'testVideo', label: '测试视频', icon: <VideoCameraOutlined /> },
  { key: 'checkVideo', label: '校准视频', icon: <VideoCameraAddOutlined /> },
  { key: 'downloadVideo', label: '视频下载', icon: <DownloadOutlined /> },
  { key: 'videoStatistic', label: '视频统计', icon: <PieChartOutlined /> },
  { key: 'phoneType', label: '手机型号', icon: <PhoneOutlined /> },
  { key: 'questionAnswer', label: '问卷答案', icon: <QuestionCircleOutlined /> },
  { key: 'upload', label: '上传管理', icon: <CloudUploadOutlined /> },
  { key: 'questionDownload', label: '问卷管理', icon: <CloudServerOutlined /> },
  { key: 'role', label: '角色管理', icon: <IdcardOutlined /> }
]

//  管理员
export const ADMIN_MENUS: Array<Record<string, any>> = [
  { key: 'user', label: '用户管理', icon: <UsergroupAddOutlined /> },
  { key: 'project', label: '项目管理', icon: <ProjectOutlined /> },
  { key: 'testVideo', label: '测试视频', icon: <VideoCameraOutlined /> },
  { key: 'questionAnswer', label: '问卷答案', icon: <QuestionCircleOutlined /> },
  { key: 'questionDownload', label: '问卷管理', icon: <CloudServerOutlined /> }
];

export const routerMap: Record<string, any> = {
  '用户管理': { path: '/user', element: <User />, title: '用户管理', icon: <UsergroupAddOutlined /> },
  '项目管理': { path: '/project', element: <Project />, title: '项目管理', icon: <ProjectOutlined /> },
  '测试视频': { path: '/testVideo', element: <TestVideo />, title: '测试视频', icon: <VideoCameraOutlined /> },
  '校准视频': { path: '/checkVideo', element: <CheckVideo />, title: '校准视频', icon: <VideoCameraAddOutlined /> },
  '视频下载': { path: '/downloadVideo', element: <DownloadVideo />, title: '视频下载', icon: <DownloadOutlined /> },
  '视频统计': { path: '/videoStatistic', element: <VideoStatistic />, title: '视频统计', icon: <PieChartOutlined /> },
  '手机型号': { path: '/phoneType', element: <PhoneType />, title: '手机型号', icon: <PhoneOutlined /> },
  '问卷答案': { path: '/questionAnswer', element: <QuestionAnswer />, title: '问卷答案', icon: <QuestionCircleOutlined /> },
  '上传管理': { path: '/upload', element: <Upload />, title: '上传管理', icon: <CloudUploadOutlined /> },
  '问卷管理': { path: '/questionDownload', element: <QuestionDownload />, title: '问卷管理', icon: <CloudServerOutlined /> },
  '角色管理': { path: '/role', element: <PermissionBox />, title: '角色管理', icon: <IdcardOutlined /> },
}

export const commonRoutes: Array<Record<string, any>> = [
  { path: '/previewAnswer', element: <PreviewAnswer /> },
  { path: '/projectDetail/:id', element: <ProjectDetail /> },
  { path: '/projectEdit/:id', element: <ProjectEdit /> },
  { path: '/answerUser', element: <AnswerUser /> },
  // { path: '/login', element: <Login /> },
  // { path: '/download', element: <Download /> }
]
