/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 15:10:18
 * @LastEditTime: 2023-10-18 14:31:26
 * @Description: 视频下载弹出层
 */
import { Ref, forwardRef, useImperativeHandle } from 'react';
import { Radio, DatePicker, Form, Select } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function DownloadVideoTemplate(props: Record<string, any> = { downloadAll: 2 }, ref?: Ref<unknown>) {
  console.log(props)
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      validate() {
        return form.validateFields()
      }
    }
  })

  return (
    <>
      <Form {...layout} form={form} initialValues={props}>
        <Form.Item label='全部下载视频' name='downloadAll'>
          <Select placeholder='请选择是否全部下载视频'>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={2}>否</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='时间范围选择' dependencies={['downloadAll']}>
          {() => (
            <>
              <DatePicker locale={zhCN} disabled={form.getFieldValue('downloadAll') === 2 || !!form.getFieldValue('downloadAll') === false} placeholder='请选择时间' style={{ width: '100%' }} />
            </>
          )}
        </Form.Item>
        <Form.Item label='选择指定用户视频下载'>
          <Select placeholder='请选择是否指定用户视频下载'>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={2}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </>
  )
}

export default forwardRef(DownloadVideoTemplate);
