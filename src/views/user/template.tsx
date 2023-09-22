/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 17:33:53
 * @LastEditTime: 2023-09-22 11:27:00
 * @Description: 创建用户、编辑用户
 */
import { useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import { Form, Input, Select } from 'antd';
import { UserTypeList } from '@/utils/const';

function UserTemplate(props = {}, cref?: Ref<unknown>) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  const form = useRef(null);

  const isEditMode = Object.keys(props).length > 0;

  useImperativeHandle(cref, () => {
    return {
      validate() {
        return (form.current! as Record<string, any>).validateFields();
      }
    };
  }, []);

  return (
    <div className="user-template mt-2">
      <Form {...layout} ref={form} initialValues={props}>
        <Form.Item name={'username'} label='用户名' rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder='请输入用户名...' disabled={isEditMode} />
        </Form.Item>
        <Form.Item name={'password'} label='密码' rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder='请输入密码...' disabled={isEditMode} visibilityToggle={!isEditMode} />
        </Form.Item>
        <Form.Item name={'phoneNumber'} label='手机号' rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
          <Input placeholder='请输入手机号...' disabled={isEditMode} />
        </Form.Item>
        <Form.Item name={'role'} label='角色'>
          <Select placeholder='请选择用户角色'>
            {UserTypeList.map(item => (
              <Select.Option value={item.value}>{item.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'remark'} label='备注'>
          <Input.TextArea placeholder='请输入备注...' />
        </Form.Item>
      </Form>
    </div >
  )
}

export default forwardRef(UserTemplate);
