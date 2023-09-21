/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:44:59
 * @LastEditTime: 2023-09-13 17:57:23
 * @Description: 路由配置
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
  CloudUploadOutlined
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

const SUPER_ADMIN_MENUS: Array<Record<string, any>> = [
  { key: 'user', label: '用户管理', icon: <UsergroupAddOutlined />, element: <User />, zIndex: 1, },
  { key: 'project', label: '项目管理', icon: <ProjectOutlined />, element: <Project />, zIndex: 1 },
  { key: 'testVideo', label: '测试视频', icon: <VideoCameraOutlined />, element: <TestVideo />, zIndex: 1 },
  { key: 'checkVideo', label: '校准视频', icon: <VideoCameraAddOutlined />, element: <CheckVideo />, zIndex: 1 },
  { key: 'downloadVideo', label: '视频下载', icon: <DownloadOutlined />, element: <DownloadVideo />, zIndex: 1 },
  { key: 'videoStatistic', label: '视频统计', icon: <PieChartOutlined />, element: null, zIndex: 1 },
  { key: 'phoneType', label: '手机型号', icon: <PhoneOutlined />, element: <PhoneType />, zIndex: 1 },
  { key: 'questionAnswer', label: '问卷答案', icon: <QuestionCircleOutlined />, element: <QuestionAnswer />, zIndex: 1 },
  { key: 'upload', label: '上传管理', icon: <CloudUploadOutlined />, zIndex: 1 },
  { key: 'login', label: '登录', icon: null, element: <Login />, zIndex: 0 },
  { key: 'download', label: '下载单页', icon: null, element: <Download />, zIndex: 0 },
]

export default SUPER_ADMIN_MENUS;
