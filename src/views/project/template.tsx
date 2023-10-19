/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-22 11:58:37
 * @LastEditTime: 2023-10-19 10:26:08
 * @Description: 项目创建模板内容
 */
import { forwardRef, useImperativeHandle, Ref, useRef } from 'react';
import { Form, Input, Radio, DatePicker } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function ProjectTemplate(props: Record<string, any> = {}, ref?: Ref<unknown>) {

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const form = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      validate() {
        return (form.current! as Record<string, any>).validateFields();
      }
    }
  }, []);

  return (
    <>
      <Form ref={form} {...(props?.layout || layout)} initialValues={props}>
        <Form.Item label='问卷标题' name='title' rules={[{ required: true, message: '请输入问卷标题' }]}>
          <Input placeholder='请输入问卷标题...' />
        </Form.Item>
        <Form.Item label='问卷开始语' name='startTips' rules={[{ required: true, message: '请输入问卷开始语' }]}>
          <Input placeholder='请输入问卷开始语...' />
        </Form.Item>
        <Form.Item label='问卷结束语' name='endTips' rules={[{ required: true, message: '请输入问卷结束语' }]}>
          <Input placeholder='请输入问卷结束语..' />
        </Form.Item>
        <Form.Item label='投放开始时间' name='startTime' rules={[{ required: true, message: '请选择投放开始时间' }]}>
          <DatePicker showTime placeholder='请输入投放开始时间..' locale={zhCN} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label='投放结束时间' name='endTime' rules={[{ required: true, message: '请选择投放结束时间' }]}>
          <DatePicker showTime placeholder='请输入投放结束时间..' locale={zhCN} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label='问卷口令' name='password'>
          <Input.Password placeholder='请输入问卷口令..' />
        </Form.Item>
        <Form.Item label='是否是眼动项目' name='isYanDong' rules={[{ required: true, message: '请选择是否是眼动项目' }]}>
          <Radio.Group defaultValue={0}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='是否是横版问卷' name='locationType' rules={[{ required: true, message: '请选择是否是横版问卷' }]}>
          <Radio.Group defaultValue={2}>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='是否随机' name='answerRandom' rules={[{ required: true, message: '请选择是否是随机' }]}>
          <Radio.Group defaultValue={0}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  )
}

export default forwardRef(ProjectTemplate);
