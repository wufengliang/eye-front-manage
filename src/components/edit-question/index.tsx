/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-25 16:24:49
 * @LastEditTime: 2023-10-26 15:25:39
 * @Description:
 */

import { Form, Input, Radio, Button, Select, InputNumber, Space, Row, Col } from 'antd';
import { TEST_FILES_TYPE_LIST, QUESTTION_TYPE_LIST } from '@/utils/const';
import { IQuestionItemType } from '@/types/question.type';
import { OperateType } from '@/types/operate.enum';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomUpload } from '@/components';

function EditQuestion(props: IQuestionItemType) {
  const { disabled = false, hasMask = false, index, onChange, isEditMode } = props;

  const {
    question,
    questionFiles,
    choicePrepares,
    choiceOptions,
    answer,
    choiceMarks,
  } = props.value;

  const defaultProps = {

  }

  const [form] = Form.useForm();

  const selectQuestionType = Form.useWatch(['question', 'type'], form);
  const selectchoicePrepares = Form.useWatch('choicePrepares', form);
  const selectTitleType = Form.useWatch('titleType', form);

  return (
    <div className="bg-gray-100 p-4">
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={form} initialValues={{ testType: 0, questionAnswer: 0, question, choicePrepares, choiceMarks }}>
        <Form.Item label='题目' className='py-1' name={['question', 'title']}>
          <Input placeholder='请输入...' />
        </Form.Item>
        <Form.Item label='题目类型' className='py-1' name={['question', 'type']}>
          <Select placeholder='请选择题目类型...' disabled>
            {QUESTTION_TYPE_LIST.map((item, index) => <Select.Option value={index} key={index}>{item}</Select.Option>)}
          </Select>
        </Form.Item>

        {/* 筛选题是没有题目开始语 */}
        {selectQuestionType !== 0 ?
          <Form.Item label='题目开始提示语' className='py-1'>
            <Input placeholder='请输入...' />
          </Form.Item> :
          null}

        {/* 筛选题是没有测试文件类型 */}
        {
          selectQuestionType !== 0 ?
            <Form.Item label='测试文件类型' className='py-1' name='titleType'>
              <Radio.Group>
                {TEST_FILES_TYPE_LIST.map(item => <Radio value={item.value}>{item.label}</Radio>)}
              </Radio.Group>
            </Form.Item> :
            null
        }

        {/* 测试文件上传 */}
        {
          selectQuestionType !== 0 && (selectTitleType !== 3 && typeof selectTitleType === 'number') ?
            (<>
              <Form.Item label={TEST_FILES_TYPE_LIST.find(item => item.value === selectTitleType)?.label}>
                <CustomUpload maxCount={1} accept='image/*' urlPath='' />
              </Form.Item>
            </>) : null
        }
        {/* 测试文件上传 */}

        {/* 图片注视时间 */}
        {
          selectQuestionType !== 0 ?
            <Form.Item label='图片注视时间' className='py-1' name={['question', 'stayTime']}>
              <InputNumber placeholder='请输入...' style={{ width: '100%' }} controls={false} />
            </Form.Item> : null
        }
        {/* 图片注视时间 */}

        <Form.Item label='选项是否随机' className='py-1' name={['question', 'choiceRandom']}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 选项 */}
        {
          [0, 1, 2, 3].includes(selectQuestionType) ?
            <Form.List name='choicePrepares' >
              {(fields, { add, remove }) => {
                return (
                  <>
                    {
                      fields.map(({ key, name, ...restField }, index: number) => {
                        return (
                          <>
                            <Row key={key} >
                              <Col span={16} offset={6}>
                                <Space className='flex items-baseline'>
                                  <Form.Item name={[name, 'type']}>
                                    <Select placeholder='请选择...' style={{ width: `100px` }}>
                                      <Select.Option value={1}>文字</Select.Option>
                                      <Select.Option value={2}>图片</Select.Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item name={[name, 'prepareName']}>
                                    <Input placeholder='请输入...' />
                                  </Form.Item>
                                  {Array.isArray(selectchoicePrepares) && selectchoicePrepares.length > 0
                                    ? <MinusCircleOutlined onClick={() => remove(name)} />
                                    : null
                                  }
                                </Space>
                              </Col>
                            </Row>
                          </>
                        )
                      })
                    }
                    <Form.Item wrapperCol={{ offset: 6 }}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        style={{ width: `250px` }}
                        icon={<PlusOutlined />}>
                        新增选项
                      </Button>
                    </Form.Item>
                  </>
                )
              }}
            </Form.List> :
            null
        }

        {/* 筛选题答案 */}
        {
          selectQuestionType === 0 ?
            (
              <>
                <Form.Item label='筛选题答案' name='questionAnswer'>
                  <Select defaultValue={0}>
                    {(selectchoicePrepares || []).map((item: Record<string, any>, index: number) => (
                      <>
                        <Select.Option value={index}>{item?.prepareName}</Select.Option>
                      </>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : null
        }
        {/* 筛选题答案 */}


        {/* 评分提选项 */}
        {
          ([4].includes(selectQuestionType)) ? <Form.List name='choiceMarks'>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ name }) => {
                    return (
                      <>
                        <Form.Item label='最大评分' className='py-1' name={[name, 'maxMark']}>
                          <Input placeholder='请输入...' />
                        </Form.Item>
                        <Form.Item label='最低分说明' className='py-1' name={[name, 'lowName']}>
                          <Input placeholder='请输入...' />
                        </Form.Item>
                        <Form.Item label='最高分说明' className='py-1' name={[name, 'maxName']}>
                          <Input placeholder='请输入...' />
                        </Form.Item>
                      </>
                    )
                  })}
                </>
              )
            }}
          </Form.List> : null
        }
        {/* 评分提选项 */}


        <Form.Item wrapperCol={{ span: 16, offset: 4 }} className='py-1'>
          <div className='flex justify-end'>
            <Button className='mx-4' onClick={() => onChange?.(OperateType.CANCEL, index, props)}>取消编辑</Button>
            <Button type='primary' onClick={() => {
              console.log(form.getFieldsValue())
            }}>确定</Button>
          </div>
        </Form.Item>
      </Form>
    </div >
  )
}

export default EditQuestion;
