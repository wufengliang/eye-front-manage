/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 13:50:29
 * @LastEditTime: 2023-10-25 19:53:09
 * @Description: 项目详情
 */
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getSurveyData } from '@/api/project';
import { to } from '@/utils/utils';
import { CustomBack, CustomMove, QuestionItem } from '@/components';
import './index.scss';

function ProjectDetail() {
  const routeParams = useParams();
  const { state } = useLocation();
  const [list, setList] = useState<any[]>([]);


  useEffect(() => {
    getData();
  }, [])

  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const [, result] = await to(getSurveyData(routeParams.id!));
    result && setList((result || []).map((item: Record<string, any>) => ({ isEditMode: false, value: item })));
  }


  /**
   * @desc 渲染主体内容
   */
  const renderMain = () => {
    return (
      <div className='main-box'>
        <div className='w-3/4 bg-white py-40 m-auto'>
          <h1 className='text-center'>{state?.title}</h1>
          <h3 className='text-center mb-20'>{state?.startTips}</h3>
          <div className='px-20'>
            <CustomMove
              disabled
              dataSource={list}
              onChange={(items) => setList(items)}
              renderItem={
                (item: any) => (
                  <QuestionItem
                    key={item?.question?.id}
                    {...item}
                  />
                )
              }
            />
          </div>
          <h3 className='text-center'>{state?.endTips}</h3>
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
