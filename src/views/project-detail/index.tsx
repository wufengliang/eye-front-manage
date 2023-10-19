/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 13:50:29
 * @LastEditTime: 2023-10-19 09:53:53
 * @Description: 项目详情
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Radio, Space, Checkbox, Input, Row, Col } from 'antd';
import { getSurveyData } from '@/api/project';
import { to } from '@/utils/utils';
import { QUESTTION_TYPE_LIST } from '@/utils/const';
import { CustomBack } from '@/components';
import './index.scss';

function ProjectDetail() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<any[]>([]);


  useEffect(() => {
    getData();
  }, [])

  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const [, result] = await to(getSurveyData(routeParams.id!));
    result && setList(result);
  }

  /**
   * @desc 渲染单个题目
   */
  const renderSingleQuestion = (item: any, index: number) => {
    const { question, questionFiles, choicePrepares, choiceOptions, answer, choiceMarks } = item;
    let content = '', footer;
    //  标题
    const title = (
      <p>
        <span className='text-red-600 mr-2'>*</span>
        <span>{index + 1}.{question?.title}</span>
        <span className='ml-2 text-gray-400'>[{QUESTTION_TYPE_LIST[question.type]}]</span>
      </p>
    )

    if (questionFiles.length > 0) {
      if (questionFiles[0].fileType === 1) {
        //  图片
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <img style={{ width: '100%' }} key={_item} src={_item.filePath} alt='上传图片' />
          </section>
        ))
      } else if (questionFiles[0].fileType === 2) {
        //  视频
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <video style={{ width: '100%' }} key={_item} src={_item.filePath} controls />
          </section>
        ))
      } else if (questionFiles[0].fileType === 3) {
        //  音频
        content = questionFiles.map((_item: any, i: number) => (
          <section key={i}>
            <audio style={{ width: '100%' }} key={_item} src={_item.filePath} controls />
          </section>
        ))
      }
    }

    if (question.type === 0) {
      //  筛选题
      footer = (
        <Radio.Group disabled>
          <Space direction='vertical'>
            {(choicePrepares || []).map((_item: any, i: number) => (
              <Radio key={_item} value={i}>{_item.prepareName}</Radio>
            ))}
          </Space>
        </Radio.Group>
      )
    }

    if (question.type === 1) {
      //  单项题
      footer = (
        <Radio.Group disabled>
          <Space direction='vertical'>
            {(choiceOptions || []).map((_item: any, i: number) => (
              <Radio key={_item.id} value={_item.id}>
                {_item.optionImage ? <img style={{ width: '150px' }} src={_item.optionImage} alt={`选项图片-${i + 1}`} /> : _item.optionName}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )
    } else if ([2, 3].includes(question.type)) {
      //  多选题
      footer = (
        <Checkbox.Group>
          {(choiceOptions || []).map((_item: any, i: number) => (
            <div style={{ width: '100%' }} key={i}>
              <Checkbox disabled>{_item.optionImage ? <img style={{ width: '150px' }} src={_item.optionImage} alt='选项图片' /> : _item.optionName}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      )
    } else if (question.type === 4) {
      //  评分提
      footer = (
        <section className='my-2'>
          <Row>
            <Col span={12}>{choiceMarks[0]?.lowName}</Col>
            <Col span={12} className='text-right'>{choiceMarks[0]?.maxName}</Col>
          </Row>
          <div className='w-full flex border border-solid border-gray-300 mt-2'>
            {Array.from({ length: choiceMarks[0].maxMark }).map((_item: any, i: number) => <div className='flex-1 my-2 text-center' key={i}>{i + 1}</div>)}
          </div>
        </section>
      )

    } else if (question.type === 5) {
      //  问答题
      footer = (
        <Input placeholder='请输入...' disabled value={answer} />
      )
    } else if (question.type === 6) {
      //  矩阵题
    }

    return (
      <div className='mb-20' key={index}>
        {title}
        {content}
        {footer}
      </div>
    )
  }

  /**
   * @desc 渲染主体内容
   */
  const renderMain = () => {
    return (
      <div className='main-box'>
        <div className='w-3/4 bg-white py-40 m-auto'>
          <h1 className='text-center'>{searchParams.get('title')}</h1>
          <h3 className='text-center mb-20'>{searchParams.get('startTips')}</h3>
          <div className='px-20'>
            {list.map(renderSingleQuestion)}
          </div>
          <h3 className='text-center'>{searchParams.get('endTips')}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className='detail-box'>
      <CustomBack />
      {renderMain()}
    </div>
  )
}

export default ProjectDetail;
