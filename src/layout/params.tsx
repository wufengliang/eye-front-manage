/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:44:59
 * @LastEditTime: 2023-08-31 16:36:18
 * @Description: 
 */
import { UsergroupAddOutlined, ProjectOutlined, VideoCameraOutlined, VideoCameraAddOutlined, DownloadOutlined, PieChartOutlined, PhoneOutlined, QuestionCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';

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
]