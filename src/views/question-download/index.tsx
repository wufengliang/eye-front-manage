/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 09:38:02
 * @LastEditTime: 2023-10-17 10:52:18
 * @Description: 问卷下载
 */
import { useState } from 'react';
import { Form, InputNumber, DatePicker, Button } from 'antd';
import { exportSurverData } from '@/api/question-download';
import dayjs from 'dayjs';

function QuestionDownload() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const { createTime, surveyId } = await form.validateFields();
    let params: Record<string, any> = { surveyId };
    if (createTime && Array.isArray(createTime)) {
      const [start, end] = createTime;
      params.createTime = [
        dayjs(start).format("YYYY-MM-DDT00:00:00"),
        dayjs(end).format("YYYY-MM-DDT00:00:00"),
      ];
    }
    try {
      const res = await exportSurverData(params);
      const file = new Blob([res.data], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.download = surveyId
        ? `问卷-${surveyId}-调查结果.xlsx`
        : `问卷调查结果-${+Date.now()}.xlsx`;
      a.href = url;
      a.click();
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='mb-6'>
      <Form layout='inline' form={form}>
        <Form.Item label='时间段' name='createTime' className='!mb-4'>
          <DatePicker.RangePicker style={{ width: '250px' }} />
        </Form.Item>
        <Form.Item label='问卷ID' name='surveyId' className='!mb-4'>
          <InputNumber placeholder='请输入问卷ID' controls={false} style={{ width: '150px' }} />
        </Form.Item>
        <Form.Item className='!mb-4'>
          <Button type='primary' loading={loading} onClick={() => submit()}>查询</Button>
          <Button type='default' className='ml-2' onClick={() => form.resetFields()}>清空</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default QuestionDownload;
