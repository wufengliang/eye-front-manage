/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:44:59
 * @LastEditTime: 2023-07-29 17:01:48
 * @Description: 
 */
import { UsergroupAddOutlined, ProjectOutlined, VideoCameraOutlined, VideoCameraAddOutlined, DownloadOutlined, PieChartOutlined, PhoneOutlined, QuestionCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';

export const SUPER_ADMIN_MENUS: Array<Record<string, any>> = [
    { key: 'user-manage', label: '用户管理', icon: <UsergroupAddOutlined /> },
    { key: 'project-manage', label: '项目管理', icon: <ProjectOutlined /> },
    { key: 'test-video', label: '测试视频', icon: <VideoCameraOutlined /> },
    { key: 'check-video', label: '校准视频', icon: <VideoCameraAddOutlined /> },
    { key: 'download-video', label: '视频下载', icon: <DownloadOutlined /> },
    { key: 'video-statistic', label: '视频统计', icon: <PieChartOutlined /> },
    { key: 'phone-type', label: '手机型号', icon: <PhoneOutlined /> },
    { key: 'question-answer', label: '问卷答案', icon: <QuestionCircleOutlined /> },
    { key: 'upload-manage', label: '上传管理', icon: <CloudUploadOutlined /> },
]