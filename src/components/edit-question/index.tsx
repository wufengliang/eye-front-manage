/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-25 16:24:49
 * @LastEditTime: 2023-10-30 14:52:22
 * @Description:
 */
import { useState, } from 'react';
import { Form, Input, Radio, Button, Select, InputNumber, Space, Row, Col, message } from 'antd';
import { TEST_FILES_TYPE_LIST, QUESTTION_TYPE_LIST, yearSeconds } from '@/utils/const';
import { IQuestionItemType } from '@/types/question.type';
import { OperateType } from '@/types/operate.enum';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomUpload } from '@/components';
import { to } from '@/utils/utils';
import { useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { addQuestion, updateQuestion } from '@/api/project';

function EditQuestion(props: IQuestionItemType) {
  const routerParams = useParams();
  const { index, onChange } = props;

  const {
    question,
    choiceMatrices,
  } = props.value;

  const [newChoiceMatrices, setChoiceMatrices] = useState<any[]>(choiceMatrices ?? []);

  const [form] = Form.useForm();

  const selectQuestionType = Form.useWatch(['question', 'type'], form);
  const selectchoicePrepares = Form.useWatch('choicePrepares', form);
  const selectTitleType = Form.useWatch(['question', 'titleType'], form);

  /**
   * @desc 保存问题 复制、编辑操作
   */
  const saveQuesition = async () => {
    const postParams: Record<string, any> = {};
    const [, result] = await to(form.validateFields());

    if (result) {
      const {
        question: formQuestion,
        questionAnswer,
        choicePrepares,
        choiceOptions,
        choiceMarks,
        titlePath,
        audioPath
      } = result;


      if (Array.isArray(choiceOptions) && choiceOptions.length > 0) {
        const newChoiceOptions = choiceOptions.map((d: Record<string, any>, i: number) => ({
          optionOrder: i,
          optionImage: d.type === 2 ? d.value : null,
          optionName: d.type === 1 ? d.value : null,
          id: d?.id
        }))
        Object.assign(postParams, { choiceOptions: newChoiceOptions });
      }

      if (question.type === 0) {
        const newChoicePrepares = (choicePrepares || []).map((item: Record<string, any>, i: number) => ({ prepareName: item.value, prepareOrder: i + 1, flag: questionAnswer === i }));
        Object.assign(postParams, { choicePrepares: newChoicePrepares, titlePath, audioPath });
      }

      const newQuestion = { ...question, ...formQuestion, questionOrder: index + 1, surveyId: routerParams?.id };


      Object.assign(postParams, { choiceMatrices: newChoiceMatrices }, { question: newQuestion, choiceMarks });


      const [, value] = await to(question?.id ? updateQuestion(postParams) : addQuestion(postParams));
      if (value) {
        message.success(`${question?.id ? '更新' : '保存'}成功`);
        onChange?.(OperateType.REFRESH, index);
      }
    }

  }

  /**
   * @desc 渲染矩阵题
   */
  const renderMatrixBox = () => {
    if (selectQuestionType !== 6) {
      return null;
    }
    const columnChildren = newChoiceMatrices.filter((item: Record<string, any>) => !!item.matrixType);
    const rowChildren = newChoiceMatrices.filter((item: Record<string, any>) => !!!item.matrixType);

    return Array.from({ length: rowChildren.length + 1 }).map((item, index) => {
      return (
        <>
          <div className='mb-2 flex'>
            {
              <>
                {Array.from({ length: columnChildren.length + 1 }).map((k, i) => {
                  return (
                    <>
                      <div className='mx-1' style={{ width: `${24 * 100 / (columnChildren.length + 2)}%` }}>
                        {index === 0 && i === 0 ?
                          <div style={{ width: `${1 / columnChildren.length + 2}` }}></div> :
                          (index === 0 && i > 0 ?
                            <Input
                              value={columnChildren[i - 1].matrixName}
                              addonAfter={
                                <DeleteOutlined
                                  className='cursor-pointer'
                                  onClick={() => {
                                    columnChildren.splice(i - 1, 1);
                                    setChoiceMatrices([...rowChildren, ...columnChildren])
                                  }}
                                />
                              }
                              onChange={(e) => {
                                columnChildren[i - 1].matrixName = e.target.value;
                                setChoiceMatrices([...rowChildren, ...columnChildren])
                              }}
                            /> :
                            (index > 0 && i === 0 ?
                              <Input
                                value={rowChildren[index - 1].matrixName}
                                addonAfter={
                                  <DeleteOutlined
                                    className='cursor-pointer'
                                    onClick={() => {
                                      rowChildren.splice(index - 1, 1);
                                      setChoiceMatrices([...rowChildren, ...columnChildren])
                                    }}
                                  />
                                }
                                onChange={(e) => {
                                  rowChildren[index - 1].matrixName = e.target.value;
                                  setChoiceMatrices([...rowChildren, ...columnChildren])
                                }}
                              /> :
                              (i !== columnChildren.length + 1 ? <div className='text-center'><Radio disabled /></div> : null)
                            )
                          )
                        }
                      </div>
                    </>
                  )
                })}

                <div className='mx-1' style={{ width: `${24 * 100 / (columnChildren.length + 2)}%` }}>
                  {index === 0 ? (
                    <Button>
                      <PlusOutlined
                        className='cursor-pointer'
                        onClick={() => {
                          setChoiceMatrices([...newChoiceMatrices, { matrixType: true, matrixName: `默认值`, matrixOrder: columnChildren.length }])
                        }}
                      />
                    </Button>
                  ) : null}
                </div>
              </>
            }
          </div>
          <div className='flex'>
            <div className='mx-1' style={{ width: `${24 * 100 / (columnChildren.length + 2)}%` }}>
              {index === rowChildren.length ? (
                <Button>
                  <PlusOutlined
                    className='cursor-pointer'
                    onClick={() => {
                      setChoiceMatrices([...newChoiceMatrices, { matrixType: false, matrixName: `默认值`, matrixOrder: rowChildren.length }])
                    }}
                  />
                </Button>
              ) : null}
            </div>
          </div>
        </>
      )
    })
  }


  return (
    <div className="bg-[#fafafa] p-4">
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={form} initialValues={{ ...props.value, testType: 0 }}>
        <Form.Item
          label='题目'
          className='py-1'
          name={['question', 'title']}
          rules={[{ required: true, message: '请输入题目' }]}
        >
          <Input placeholder='请输入...' />
        </Form.Item>
        <Form.Item
          label='题目类型'
          className='py-1'
          name={['question', 'type']}
        >
          <Select placeholder='请选择题目类型...' disabled>
            {QUESTTION_TYPE_LIST.map((item, index) => <Select.Option value={index} key={index}>{item}</Select.Option>)}
          </Select>
        </Form.Item>

        {/* 筛选题是没有题目开始语 */}
        {selectQuestionType !== 0 ?
          <Form.Item
            label='题目开始提示语'
            className='py-1'
            name={['question', 'tips']}
            rules={[{ required: true, message: '请输入题目开始提示语' }]}
          >
            <Input placeholder='请输入...' />
          </Form.Item> :
          null}

        {/* 筛选题是没有测试文件类型 */}
        {
          selectQuestionType !== 0 ?
            <Form.Item
              label='测试文件类型'
              className='py-1'
              name={['question', 'titleType']}
              rules={[{ required: true, message: '请选择测试文件类型' }]}
            >
              <Radio.Group>
                {TEST_FILES_TYPE_LIST.map(item => <Radio value={item.value}>{item.label}</Radio>)}
              </Radio.Group>
            </Form.Item> :
            null
        }

        {/* 测试文件上传 */}
        {
          selectQuestionType !== 0 && (selectTitleType !== 4 && selectTitleType > 0 && typeof selectTitleType === 'number') ?
            (<>
              <Form.Item
                valuePropName='dataSource'
                label={TEST_FILES_TYPE_LIST.find(item => item.value === selectTitleType)?.label}
                rules={[{ required: true, message: `请上传测试文件` }]}
                name={['question', `${selectTitleType === 1 ? 'titlePath' : ([2, 3].includes(selectTitleType) ? 'audioPath' : '')}`]}
              >
                <CustomUpload
                  maxCount={1}
                  expireTime={yearSeconds}
                  accept={TEST_FILES_TYPE_LIST.find(item => item.value === selectTitleType)?.accept}
                  urlPath='/admin/question/title'
                />
              </Form.Item>
            </>) : null
        }
        {/* 测试文件上传 */}

        {/* 图片注视时间 */}
        {
          selectQuestionType !== 0 ?
            <Form.Item
              label='图片注视时间'
              className='py-1'
              name={['question', 'stayTime']}
              rules={[{ required: true, message: '请输入注视时间' }]}
            >
              <InputNumber placeholder='请输入...' style={{ width: '100%' }} controls={false} />
            </Form.Item> : null
        }
        {/* 图片注视时间 */}

        {/* 选项是否随机 */}
        {
          [4, 5].includes(selectQuestionType)
            ? null
            : (
              <Form.Item
                label='选项是否随机'
                className='py-1'
                name={['question', 'choiceRandom']}
                rules={[{ required: true, message: '请选择是否随机' }]}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            )
        }

        {/* 选项 筛选题 */}
        {
          selectQuestionType === 0 ?
            <Form.List name='choicePrepares'>
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
                                  <Form.Item
                                    name={[name, 'type']}
                                    rules={[{ required: true, message: '请选择类型' }]}
                                  >
                                    <Select placeholder='请选择...' style={{ width: `100px` }}>
                                      <Select.Option value={1}>文字</Select.Option>
                                      <Select.Option value={2} disabled={selectQuestionType === 0}>图片</Select.Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    shouldUpdate={(prevValues, currentValues) => prevValues.choicePrepares[name]?.type !== currentValues.choicePrepares[name]?.type}>
                                    {({ getFieldValue }) => {
                                      const v = getFieldValue(['choicePrepares', name, 'type']);
                                      return (
                                        <>
                                          <Form.Item
                                            name={[name, 'value']}
                                            valuePropName={v === 1 ? 'value' : 'dataSource'}
                                            rules={[{ required: [1, 2].includes(v), message: v === 1 ? '请输入选项值' : (v === 2 ? '请上传文件' : '') }]}
                                          >
                                            {v === 1 ? <Input placeholder='请输入...' /> : ((v === 2) ? <CustomUpload maxCount={1} expireTime={yearSeconds} urlPath='/admin/common' /> : null)}
                                          </Form.Item>
                                        </>
                                      )
                                    }}
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
                        onClick={() => add({ type: null, value: null })}
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

        {/* 选项 */}
        {
          [1, 2, 3,].includes(selectQuestionType) ?
            <>
              <Form.List name={'choiceOptions'}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {
                        fields.map(({ key, name, }) => {
                          return (
                            <>
                              <Row key={key} >
                                <Col span={16} offset={6}>
                                  <Space className='flex items-baseline'>
                                    <Form.Item
                                      name={[name, 'type']}
                                      rules={[{ required: true, message: '请选择类型' }]}
                                    >
                                      <Select placeholder='请选择...' style={{ width: `100px` }}>
                                        <Select.Option value={1}>文字</Select.Option>
                                        <Select.Option value={2}>图片</Select.Option>
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      shouldUpdate={(prevValues, currentValues) => prevValues.choiceOptions[name]?.type !== currentValues.choiceOptions[name]?.type}>
                                      {({ getFieldValue }) => {
                                        const v = getFieldValue(['choiceOptions', name, 'type']);
                                        return (
                                          <>
                                            <Form.Item
                                              name={[name, 'value']}
                                              rules={[{ required: [1, 2].includes(v), message: v === 1 ? '请输入选项值' : (v === 2 ? '请上传文件' : '') }]}
                                              valuePropName={v === 1 ? 'value' : 'dataSource'}
                                            >
                                              {v === 1 ? <Input placeholder='请输入...' /> : ((v === 2) ?
                                                <CustomUpload
                                                  urlPath='/admin/common' maxCount={1}
                                                  expireTime={yearSeconds}
                                                /> : null)}
                                            </Form.Item>
                                          </>
                                        )
                                      }}
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
                          onClick={() => add({ type: null, value: null })}
                          block
                          style={{ width: `250px` }}
                          icon={<PlusOutlined />}>
                          新增选项
                        </Button>
                      </Form.Item>
                    </>
                  )
                }}
              </Form.List>
            </> :
            null
        }

        {/* 筛选题答案 */}
        {
          selectQuestionType === 0 ?
            (
              <>
                <Form.Item
                  label='筛选题答案'
                  name='questionAnswer'
                  rules={[{ required: true, message: '请选择筛选题答案' }]}
                >
                  <Select placeholder='请选择筛选题答案' style={{ maxWidth: `200px` }}>
                    {(selectchoicePrepares || []).map((item: Record<string, any>, index: number) => (
                      <>
                        <Select.Option value={index}>{item?.prepareName ?? item?.value ?? `选项${index + 1}`}</Select.Option>
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
          selectQuestionType === 4 ? <Form.List name='choiceMarks'>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ name }) => {
                    return (
                      <>
                        <Form.Item
                          label='最大评分'
                          className='py-1' name={[name, 'maxMark']}
                          rules={[{ required: true, message: '请输入最大评分...' }]}
                        >
                          <Input placeholder='请输入...' />
                        </Form.Item>
                        <Form.Item
                          label='最低分说明'
                          className='py-1'
                          name={[name, 'lowName']}
                          rules={[{ required: true, message: '请输入最低评分说明' }]}
                        >
                          <Input placeholder='请输入...' />
                        </Form.Item>
                        <Form.Item
                          label='最高分说明'
                          className='py-1'
                          name={[name, 'maxName']}
                          rules={[{ required: true, message: '请输入最高分说明' }]}
                        >
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

        {/*  渲染矩阵题 */}
        {renderMatrixBox()}


        <Form.Item wrapperCol={{ span: 16, offset: 4 }} className='py-1'>
          <div className='flex justify-end'>
            <Button className='mx-4' onClick={() => onChange?.(OperateType.CANCEL, index, props)}>取消编辑</Button>
            <Button type='primary' onClick={() => saveQuesition()}>确定</Button>
          </div>
        </Form.Item>
      </Form>
    </div >
  )
}

export default EditQuestion;
