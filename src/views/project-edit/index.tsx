/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 17:46:04
 * @LastEditTime: 2023-10-19 10:29:06
 * @Description: 项目编辑
 */

import { QUESTTION_ICON_LIST } from '@/utils/const';
import classNames from 'classnames';
import { Tabs, Switch, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ProjectTemplate from '@/views/project/template';
import { CustomBack } from '@/components';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

function ProjectEdit() {
  const { state } = useLocation();

  /**
   * @desc 左侧空间
   */
  const leftBox = () => {
    return (
      <div className="left-box" style={{ width: '140px' }}>
        <h3 className="text-blue-500 text-center">题目控件</h3>
        {QUESTTION_ICON_LIST.map(item => {
          return (
            <div className='cursor-pointer mb-4 p-2 w-20 m-auto flex items-center' key={item.value}>
              <i className={classNames(['iconfont', item.iconName])}></i>
              <span className='ml-1'>{item.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * @desc 右侧空间
   */
  const rightBox = () => {
    return (
      <div className="right-box px-3">
        <div className="flex items-center">
          <span className='mr-2'>允许提交</span>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
          <Button className='mx-2'>退出编辑</Button>
          <Button type='primary'>保存问卷</Button>
        </div>
        <div className='mt-5'>
          <ProjectTemplate layout={{
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }}
            {...Object.assign({}, state, { startTime: dayjs(state.startTime), endTime: dayjs(state.endTime) })}
          />
        </div>
      </div>
    )
  }

  /**
   * @desc 中间空间
   */
  const centerBox = () => {
    return (
      <div className="center-box flex-1 border border-solid border-gray-200">
        <Tabs type='card'
          items={[
            {
              label: '开始页',
              key: '1',
              children: (
                <div>
                  <h3 className='text-center'>{state?.title}</h3>
                  <p className='text-center'>{state?.startTips}</p>
                </div>
              )
            },
            {
              label: '结束页',
              key: '2',
              children: (
                <p className="text-center">{state?.endTips}</p>
              )
            }
          ]} />
      </div>
    )
  }

  return (
    <div className="edit-box">
      <CustomBack />
      <div className='flex'>
        {leftBox()}
        {centerBox()}
        {rightBox()}
      </div>
    </div>
  )
}

export default ProjectEdit;
