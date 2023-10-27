/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-26 15:30:56
 * @LastEditTime: 2023-10-27 17:59:39
 * @Description: 问卷预览
 */
import { useState, useEffect } from 'react';
import { Empty } from 'antd';
import { CustomBack } from '@/components';
import { previewSurveyAnswer } from '@/api/question-answer';
import { useSearchParams } from 'react-router-dom';
import { to } from '@/utils/utils';
import { QuestionItem } from '@/components';

function PreviewAnswer() {

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getData();
  }, [])


  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const surveyId = Number(searchParams.get('surveyId'));
    const userId = searchParams.get('userId');
    const [, result] = await to(previewSurveyAnswer({ surveyId, userId }));
    result && setDataSource(result?.qaList || []);
  }

  return (
    <>
      <CustomBack bgClassName={'bg-white !top-1 py-2 z-10'} />
      <div>
        {Array.isArray(dataSource) && dataSource.length > 0 ? dataSource.map((item: Record<string, any>, index: number) => {
          return (
            <div key={index} className='border border-dashed mb-5'>
              <QuestionItem disabled index={index} value={item?.question}>
                <div className='px-10'>
                  <p className='text-red-500'>用户选择答案是:</p>
                  {(item?.answer?.answerPath ?? []).map((url: string) => <img width={100} src={url} alt='选择的答案' />)}
                </div>
              </QuestionItem>
            </div>
          )
        }) : <Empty description='暂无用户预览答案' />}
      </div>
    </>
  )
}

export default PreviewAnswer;
