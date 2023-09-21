/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-20 14:13:19
 * @LastEditTime: 2023-09-20 17:37:22
 * @Description: 创建/编辑 手机型号
 */
import { useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import { Form, Input, InputNumber } from 'antd';

function PhoneTypeTemplate(props = {}, ref?: Ref<unknown>) {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 15 },
  };

  const form = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      validate() {
        return (form.current! as Record<string, any>).validateFields();
      }
    }
  })

  return (
    <div className='phoneTypeTemplate'>
      <Form {...layout} ref={form} initialValues={props}>
        <Form.Item label='手机型号' name='phoneModel' rules={[{ required: true, message: '请输入手机型号' }]}>
          <Input placeholder='请输入手机型号' />
        </Form.Item>
        <Form.Item label='手机别名' name='phoneAlias' rules={[{ required: true, message: '请输入手机别名' }]}>
          <Input placeholder='请输入手机别名' />
        </Form.Item>
        <Form.Item label='屏幕横像素' name='xlength' rules={[{ required: true, message: '请输入屏幕横像素' }]}>
          <InputNumber placeholder='请输入屏幕横像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
        <Form.Item label='屏幕竖像素' name='ylength' rules={[{ required: true, message: '请输入屏幕竖像素' }]}>
          <InputNumber placeholder='请输入屏幕竖像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
        <Form.Item label='摄像头距离左侧像素' name='leftLength' rules={[{ required: true, message: '请输入摄像头距离左侧像素' }]}>
          <InputNumber placeholder='请输入摄像头距离左侧像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
        <Form.Item label='摄像头距离右侧像素' name='rightLength' rules={[{ required: true, message: '请输入摄像头距离右侧像素' }]}>
          <InputNumber placeholder='请输入摄像头距离右侧像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
        <Form.Item label='摄像头距离上侧像素' name='upperLength' rules={[{ required: true, message: '请输入摄像头距离上侧像素' }]}>
          <InputNumber placeholder='请输入摄像头距离上侧像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
        <Form.Item label='摄像头距离下侧像素' name='lowerLength' rules={[{ required: true, message: '请输入摄像头距离下侧像素' }]}>
          <InputNumber placeholder='请输入摄像头距离下侧像素' style={{ width: '100%' }} min={0} controls={false} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(PhoneTypeTemplate);
