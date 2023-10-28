/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-24 15:29:11
 * @LastEditTime: 2023-10-29 01:09:25
 * @Description: 问题展示
 */
import { useState, useRef } from 'react';
import { type IQuestionItemType } from '@/types/question.type';
import { QUESTTION_TYPE_LIST } from '@/utils/const';
import classNames from 'classnames';
import { Checkbox, Col, Input, Radio, Row, Space, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { OperateType } from '@/types/operate.enum';
import { omit } from 'lodash-es';
import './index.scss';

function QuestionItem(props: IQuestionItemType) {
  const { disabled = false, hasMask = false, index, onChange, isEditMode, children } = props;
  const {
    question,
    questionFiles,
    choicePrepares,
    choiceOptions,
    answer,
    choiceMarks,
    choiceMatrices,
  } = props.value;

  const [isHover, setHover] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(isEditMode || false);

  //  标题
  const title = (
    <p>
      <span className='text-red-600 mr-2'>*</span>
      <span>{index + 1}.{question?.title}</span>
      <span className='ml-2 text-gray-400'>[{QUESTTION_TYPE_LIST[question?.type]}]</span>
    </p>
  )

  const renderSingleQuestion = () => {
    let content: any = null;
    let footer: any = null;
    if (questionFiles && questionFiles.length > 0) {
      if (questionFiles[0].fileType === 1) {
        //  图片
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <img style={{ width: '200px' }} key={_item} src={_item.filePath} alt='上传图片' />
          </section>
        ))
      } else if (questionFiles[0].fileType === 2) {
        //  视频
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <video style={{ width: '80%' }} key={_item} src={_item.filePath} controls />
          </section>
        ))
      } else if (questionFiles[0].fileType === 3) {
        //  音频
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <audio style={{ width: '80%' }} key={_item} src={_item.filePath} controls />
          </section>
        ))
      }
    }

    if (question.type === 0) {
      //  筛选题
      footer = (
        <Space direction='vertical'>
          {(choicePrepares || []).map((_item: any, i: number) => (
            <Radio key={`${_item?.id}-${i}`} disabled={disabled} value={i} checked={_item.flag}>{_item.prepareName}</Radio>
          ))}
        </Space>
      )
    }

    if (question.type === 1) {
      //  单项题
      footer = (
        <>
          <Radio.Group disabled={disabled}>
            <Space direction='vertical'>
              {(choiceOptions || []).map((_item: any, i: number) => (
                <Radio key={_item.id} value={_item.id}>
                  {_item.optionImage ? <img style={{ width: '150px' }} src={_item.optionImage} alt={`选项图片-${i + 1}`} /> : `${_item.optionName || '未命名'}`}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </>
      )
    } else if ([2, 3].includes(question.type)) {
      //  多选题
      footer = (
        <Checkbox.Group>
          {(choiceOptions || []).map((_item: any, i: number) => (
            <div style={{ width: '100%' }} key={i}>
              <Checkbox disabled={disabled}>{_item.optionImage ? <img style={{ width: '150px' }} src={_item.optionImage} alt='选项图片' /> : _item.optionName}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      )
    } else if (question.type === 4) {
      //  评分提
      footer = (
        <section className='my-2'>
          <Row>
            <Col span={12}>{choiceMarks![0]?.lowName}</Col>
            <Col span={12} className='text-right'>{choiceMarks![0]?.maxName}</Col>
          </Row>
          <div className='w-full flex border border-solid border-gray-300 mt-2'>
            {Array.from({ length: choiceMarks![0].maxMark }).map((_item: any, i: number) => <div className='flex-1 my-2 text-center' key={i}>{i + 1}</div>)}
          </div>
        </section>
      )
    } else if (question.type === 5) {
      //  问答题
      footer = (
        <Input placeholder='请输入...' disabled={disabled} value={answer} />
      )
    } else if (question.type === 6) {
      const columnChildren = (choiceMatrices ?? []).filter((item: Record<string, any>) => !!item.matrixType);
      const rowChildren = (choiceMatrices ?? []).filter((item: Record<string, any>) => !!!item.matrixType);


      //  矩阵题
      footer = (
        <>
          {
            Array.from({ length: rowChildren.length + 1 }).map((item, index) => {
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
                                    <div className='text-center'>{columnChildren[i - 1].matrixName}</div> :
                                    (index > 0 && i === 0 ?
                                      <div className='text-center'>{rowChildren[index - 1].matrixName}</div> :
                                      (i !== columnChildren.length + 1 ? <div className='text-center'><Radio disabled /></div> : null)
                                    )
                                  )
                                }
                              </div>
                            </>
                          )
                        })}
                      </>
                    }
                  </div>

                </>
              )
            })
          }
        </>
      )
    }

    const showDetail = () => {
      return (
        <>
          <div className='flex-1'>
            {title}
            {content}
            {footer ? <div className='my-2'>{footer}</div> : null}
          </div>
        </>
      )
    }

    //  操作按钮
    const operateBox = () => {
      return (
        <>
          <div className={
            classNames(
              'operate-box cursor-auto box-border absolute right-0 top-0 h-full border-solid bg-white border-gray-300  flex flex-col justify-center z-10',
            )
          }
          >
            <div className='my-2 text-center'>
              <CopyOutlined
                className='cursor-pointer'
                title='复制'
                onClick={() => onChange?.(OperateType.COPY, index, omit(props, ['disabled', 'onChange', 'hasMask', 'key']))}
              />
            </div>
            <div className='my-2 text-center'>
              <i
                className="iconfont cursor-pointer icon-bianji"
                title='编辑'
                onClick={() => onChange?.(OperateType.EDIT, index, omit(props, ['disabled', 'onChange', 'hasMask', 'key']))}
              />
            </div>
            <div className='my-2 text-center'>
              <i
                className="iconfont cursor-pointer icon-shanchu"
                title='删除'
                onClick={() => Modal.confirm({
                  title: '提示',
                  content: `您确定删除该题目吗？`,
                  onOk: () => onChange?.(OperateType.DELETE, index, props)
                })}
              />
            </div>
          </div>
        </>
      )
    }

    return (
      <div
        className={classNames(
          'mb-20 p-10 flex relative choose-box',
          { 'border border-solid border-gray-300': !disabled && isHover },
        )
        }
        key={`${question?.type}-${question?.id}-${index}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hasMask ? <div className='absolute top-0 left-0 w-full h-full z-10'></div> : null}
        {editMode ? null : showDetail()}
        {editMode || disabled ? null : operateBox()}
      </div>
    )
  }


  return (
    <>
      {renderSingleQuestion()}
      {children}
    </>
  )
}

export default QuestionItem;
