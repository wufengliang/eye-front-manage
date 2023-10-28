/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-28 18:58:32
 * @LastEditTime: 2023-10-28 23:24:09
 * @Description:
 */
import { forwardRef, useImperativeHandle, Ref, useRef, useEffect, useState } from 'react';
import { Input, Form, Button, Space, Modal, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { IBgQuestionType } from '@/types/question.type';
import { updateProfileData } from '@/api/project';
import { to } from '@/utils/utils';

function QuestionList(props: Record<string, any> = {}, ref?: Ref<unknown>) {
  const { surveyId, dataSource, disabled, rightSlot, index } = props;
  console.log(dataSource);
  const [form] = Form.useForm();

  const [list, setList] = useState<IBgQuestionType>(
    dataSource ?? {
      choiceProfiles: [{ profileName: '', surveyId }],
      profileQuestion: { questionName: '', surveyId }
    }
  )

  useEffect(() => {
    setList(props.dataSource ?? {
      choiceProfiles: [{ profileName: '', surveyId }],
      profileQuestion: { questionName: '', surveyId }
    })
  }, [props.dataSource, surveyId])

  const choiceArray = Form.useWatch('choiceProfiles', form);

  useImperativeHandle(ref, () => {
    return {
      validate: () => form.validateFields()
    }
  })

  /**
   * @desc 删除答案
   */
  const deleteChoice = (index: number, remove: (i: number) => void) => {
    const data = choiceArray[index];
    if (!data) {
      return message.error(`数据异常`)
    }
    remove(index);
  }

  //  渲染问题
  const renderQuestion = () => {
    return (
      <>
        <Space align={disabled ? 'baseline' : 'start'} className='w-full'>
          <Form.Item label={`问题${typeof index === 'number' ? index + 1 : ''}`} name={['profileQuestion', 'questionName']} rules={disabled ? [] : [{ required: true, message: '请输入问题' }]}>
            <Input placeholder='请输入...' disabled={disabled} />
          </Form.Item>
          {!disabled && choiceArray?.length === 0 ? (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                const v = { ...list, choiceProfiles: list.choiceProfiles.concat({ profileName: '', surveyId }) };
                setList(v);
                form.setFieldsValue(v);
              }}>添加答案</Button>
          ) : null}
          {rightSlot}
        </Space>
      </>
    )
  }

  //  渲染选项
  const renderChoice = () => {
    return (
      <Form.List name='choiceProfiles'>
        {(fields, { add, remove }) => {
          return (
            fields.map(({ key, name }, index: number) => {
              return (
                <Space align='start' key={key}>
                  <Form.Item
                    labelCol={{ offset: disabled ? 8 : 2 }}
                    name={[name, 'profileName']}
                    label={`答案选项${index + 1}`}
                    rules={disabled ? [] : [{ required: true, message: `请输入答案${index + 1}` }]}
                  >
                    <Input disabled={disabled} placeholder='请输入...' style={{ width: `${disabled ? 200 : 150}px` }} />
                  </Form.Item>
                  {!disabled ? (<Button className='ml-6' type='primary' icon={<PlusOutlined />} onClick={() => add({ profileName: '', surveyId })}>
                    添加答案
                  </Button>) : null}
                  {fields.length === 1 ? null : (
                    disabled ? null : (
                      <Button disabled={disabled} onClick={() => deleteChoice(index, remove)}>
                        <DeleteOutlined />
                      </Button>
                    )
                  )}
                </Space>
              )
            })
          )
        }}
      </Form.List>
    )
  }

  return (
    <div className='my-5 max-h-96 overflow-y-auto'>
      <Form form={form} initialValues={list} labelCol={{ span: disabled ? 12 : 0 }}>
        {renderQuestion()}
        {renderChoice()}
      </Form>
    </div>
  )
}

export default forwardRef(QuestionList);
