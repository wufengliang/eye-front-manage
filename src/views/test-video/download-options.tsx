/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-19 14:07:52
 * @LastEditTime: 2023-10-19 14:21:21
 * @Description: 批量下载
 */
import { forwardRef, Ref, useImperativeHandle } from 'react';
import { Form, DatePicker, InputNumber } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function DownloadOptions(props = {}, ref?: Ref<unknown>) {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      getValues() {
        return form.getFieldsValue();
      }
    }
  })

  return (
    <div className="my-5">
      <Form form={form}>
        <Form.Item name='createTime' label='时间段'>
          <DatePicker.RangePicker locale={zhCN} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name='surveyId' label='问卷ID'>
          <InputNumber placeholder='请输入问卷ID' style={{ width: '100%' }} controls={false} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(DownloadOptions);
