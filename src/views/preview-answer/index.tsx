/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-26 15:30:56
 * @LastEditTime: 2023-10-26 15:39:47
 * @Description: 问卷预览
 */
import { useState, useEffect } from 'react';
import { CustomBack } from '@/components';
import { previewSurveyAnswer } from '@/api/question-answer';
import { useSearchParams } from 'react-router-dom';
import { to } from '@/utils/utils';

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
      <CustomBack />

    </>
  )
}

export default PreviewAnswer;
