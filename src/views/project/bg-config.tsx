/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-28 17:23:51
 * @LastEditTime: 2023-10-28 23:34:04
 * @Description:
 */
import { forwardRef, useImperativeHandle, Ref, useRef, useEffect, useState } from 'react';
import { Button, Empty, Modal, message } from 'antd';
import { addProfileData, deleteProfileData, getProfileData, updateProfileData } from '@/api/project';
import { to } from '@/utils/utils';
import { OperateType } from '@/types/operate.enum';
import QuestionList from './question-list';
import { IBgQuestionType } from '@/types/question.type';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function BgTemplate(props: Record<string, any> = {}, ref?: Ref<unknown>) {

  const [dataSource, setDataSource] = useState<any[]>([]);
  const bgRef = useRef<Record<string, any>>(null);


  useImperativeHandle(ref, () => {
    return {
      getResult: () => dataSource
    }
  })

  useEffect(() => {
    getData();
  }, [])

  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const [, result] = await to(getProfileData(props.surveyId));
    result && setDataSource(result.map((item: Record<string, any>) => ({ ...item, choiceProfiles: item?.choiceProfiles ?? item.profileChoices })));
  }

  /**
   * @desc 渲染按钮
   */
  const renderButtons = () => {
    return (
      <div className='my-5'>
        <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>新增背景问题配置</Button>
      </div>
    )
  }

  /**
   * @desc 按钮操作
   * @param {OperateType} type 类型
   * @param {Record<string,any>} data 数据源
   */
  const handleOperate = async (type: OperateType, data?: Record<string, any>) => {
    switch (type) {
      case OperateType.ADD:
        return Modal.confirm({
          title: '新增背景问题',
          icon: null,
          content: <QuestionList surveyId={props.surveyId} ref={bgRef} />,
          width: 520,
          closable: true,
          maskClosable: false,
          onOk: async () => {
            const { validate } = bgRef.current!;
            const [error, result] = await to(validate());
            if (result) {
              const { profileQuestion, choiceProfiles } = result as IBgQuestionType;
              const postParams = {
                profileQuestion: { ...profileQuestion, surveyId: props.surveyId },
                choiceProfiles: choiceProfiles.map(
                  (item, index) => (
                    {
                      id: item?.id,
                      profileOrder: item?.profileOrder ?? index,
                      profileQuestionId: profileQuestion?.id,
                      profileName: item?.profileName,
                      surveyId: item?.surveyId ?? props.surveyId
                    }
                  )
                )
              }
              const [errVal] = await to(addProfileData(postParams));
              if (!errVal) {
                message.success(`新增背景问题成功`);
                getData();
                return;
              }
            }
            return Promise.reject(error);
          }
        });
      case OperateType.DELETE:
        return Modal.confirm({
          title: '提示',
          content: '确认要删除该问题吗？',
          maskClosable: false,
          onOk: async () => {
            const [err] = await to(deleteProfileData(data?.profileQuestion?.id));
            if (!err) {
              message.success('删除成功');
              getData();
              return;
            }
            return Promise.reject(err);
          }
        });
      case OperateType.EDIT:
        return Modal.confirm({
          title: '编辑背景问题',
          content: <QuestionList dataSource={data} ref={bgRef} />,
          width: 520,
          icon: null,
          maskClosable: false,
          closable: true,
          onOk: async () => {
            const { validate } = bgRef.current!;
            const [error, result] = await to(validate());

            if (result) {
              const { profileQuestion, choiceProfiles } = result as IBgQuestionType;

              const newProfileQuestion = { ...data?.profileQuestion, ...profileQuestion, surveyId: props.surveyId };
              const hasIdChoiceProfiles = (choiceProfiles ?? []).filter(item => item.id);
              const noIdChoiceProfiles = (choiceProfiles ?? []).filter(item => !item.id);

              const pArray = [];

              pArray.push(updateProfileData({ profileQuestion: newProfileQuestion, choiceProfiles: hasIdChoiceProfiles }));
              if (noIdChoiceProfiles.length > 0) {
                pArray.push(addProfileData({ profileQuestion: newProfileQuestion, choiceProfiles: noIdChoiceProfiles }));
              }

              const [error] = await to(Promise.all(pArray));
              if (!error) {
                message.success(`更新背景问题成功`);
                getData();
                return;
              }
            }
            return Promise.reject(error);
          }
        })
    }
  }

  return (
    <div className='my-5 overflow-y-auto max-h-96'>
      {renderButtons()}
      {
        !(Array.isArray(dataSource)) || (Array.isArray(dataSource) && dataSource.length === 0) ?
          (
            <Empty description='暂无背景问题' />
          ) :
          dataSource.map((item, index) => (
            <QuestionList
              surveyId={props.surveyId}
              dataSource={item}
              key={index}
              index={index}
              disabled={true}
              rightSlot={(
                <>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleOperate(OperateType.DELETE, item)}
                  />

                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleOperate(OperateType.EDIT, item)}
                  />
                </>
              )}
            />
          ))
      }
    </div >
  )
}

export default forwardRef(BgTemplate);
