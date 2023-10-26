/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 17:46:04
 * @LastEditTime: 2023-10-26 16:21:10
 * @Description: 项目编辑
 */
import { useEffect, useState, useRef } from 'react';
import { QUESTTION_ICON_LIST } from '@/utils/const';
import classNames from 'classnames';
import { Tabs, Switch, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ProjectTemplate from '@/views/project/template';
import { CustomBack, CustomMove, QuestionItem, EditQuestion } from '@/components';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getSurveyData, deleteQuestion, updateProjectData } from '@/api/project';
import { OperateType } from '@/types/operate.enum';
import { to } from '@/utils/utils';
import { omit } from 'lodash-es';
import './index.scss';

function ProjectEdit() {
  const { state } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const checked = useRef<boolean>(false);
  const projectRef = useRef<Record<string, any>>(null);


  useEffect(() => {
    getData();
  }, [])
  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const { id } = params;
    const [, result] = await to(getSurveyData(id!));
    result && setList((result || []).map((item: Record<string, any>) => ({ isEditMode: false, value: item })));
    // result && setList(result);
  }


  /**
   * @desc 操作单项
   * @param {Number} index 数据在数据队列中的索引
   * @param {Record} data 数据源
   */
  const handleOperate = async (type: OperateType, index: number, data?: Record<string, any>,) => {
    const newList = [...list];
    switch (type) {
      case OperateType.DELETE:
        const { id } = data?.question;
        const [error] = await to(deleteQuestion(id));
        if (!error) {
          newList.splice(index, 1);
          setList(newList);
          getData();
        }
        return;
      case OperateType.COPY:
        return setList([...newList].concat({ ...omit({ ...data }, ['index']), isEditMode: true }));
      case OperateType.EDIT:
        const bool = newList.some(item => item.isEditMode);
        if (bool) {
          return message.warning(`当前正有问题编辑中，请核对后重试`)
        }
        newList.splice(index, 1, { isEditMode: true, value: { ...data?.value } });
        return setList(newList);
      case OperateType.CANCEL:
        newList.splice(index, 1, { isEditMode: false, value: { ...data?.value } })
        return setList(newList);
    }
  }

  /**
   * @desc 保存问卷
   */
  const saveSurvey = async () => {
    const { validate } = projectRef.current!;
    const [, value] = await to(validate());
    if (value) {
      const postParams = {
        id: params.id,
        status: checked.current ? 0 : 1,
        ...value,
        startTime: dayjs(value.startTime).format('YYYY-MM-DD[T]HH:mm:ss'),
        endTime: dayjs(value.startTime).format('YYYY-MM-DD[T]HH:mm:ss')
      }
      const [error] = await to(updateProjectData(postParams));
      if (!error) {
        checked.current ? message.warning(`警告：如果已收集数据，更改问卷问题会导致数据错乱！`) : message.success(`保存成功`);
        navigate(-1);
      }
    }
  }

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
      <div className="right-box px-3 sticky top-0 h-full">
        <div className="flex items-center">
          <span className='mr-2'>允许提交</span>
          <Switch
            defaultChecked={checked.current}
            onChange={(bool) => checked.current = bool}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
          <Button className='mx-2' onClick={() => {
            const bool = list.some(item => item.isEditMode);
            if (bool) {
              return message.error(`当前有问题内容还在编辑中`);
            }
            navigate(-1);
          }}>退出编辑</Button>
          <Button type='primary' onClick={() => saveSurvey()}>保存问卷</Button>
        </div>
        <div className='mt-5'>
          <ProjectTemplate
            layout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            ref={projectRef}
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
        <div className='h-full'>
          <Tabs type='card'
            items={[
              {
                label: '开始页',
                key: '1',
                children: (
                  <div className='h-full overflow-y-auto'>
                    <h3 className='text-center'>{state?.title}</h3>
                    <p className='text-center'>{state?.startTips}</p>
                    <div className='p-5'>
                      <CustomMove
                        dataSource={list}
                        onChange={(v: any[]) => setList(v)}
                        disabled={list.some(item => item.isEditMode)}
                        renderItem={
                          (item: any) => {
                            return item?.isEditMode
                              ? <EditQuestion
                                onChange={(type: OperateType, index: number, currentValue?: Record<string, any>) => handleOperate(type, index, currentValue)}
                                {...item}
                              />
                              : (
                                <QuestionItem
                                  hasMask
                                  isEditMode={item.isEditMode}
                                  onChange={(type: OperateType, index: number, currentValue?: Record<string, any>) => handleOperate(type, index, currentValue)}
                                  {...item}
                                />
                              )
                          }}
                      />
                    </div>
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
      </div>
    )
  }

  return (
    <div className="edit-box h-screen flex flex-col overflow-hidden">
      {/* <div className="bg-white p-5">
        <CustomBack />
      </div> */}
      <div className='flex flex-1 p-5 h-full box-border'>
        {leftBox()}
        {centerBox()}
        {rightBox()}
      </div>
    </div>
  )
}

export default ProjectEdit;
