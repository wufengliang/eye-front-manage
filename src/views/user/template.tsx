/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-08 17:33:53
 * @LastEditTime: 2024-05-30 21:07:38
 * @Description: 创建用户、编辑用户
 */
import { useRef, forwardRef, useImperativeHandle, Ref, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { USER_TYPE_LIST } from '@/utils/const';

function UserTemplate(props: Record<string, any> = {}, cref?: Ref<unknown>) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();

  const isEditMode = Object.keys(props).length > 1;

  useImperativeHandle(cref, () => {
    return {
      validate() {
        return form.validateFields();
      }
    };
  }, []);

  const checkPasswordVal = (isFocus: boolean = true) => {
    if (!isEditMode) {
      return;
    }

    const v = form.getFieldValue('password');

    if (isFocus && v.trim() === '******') {
      return form.setFieldValue('password', '');
    }

    if (!isFocus && v.trim().length === 0) {
      return form.setFieldValue('password', '******');
    }
  }

  return (
    <div className="user-template mt-2">
      <Form {...layout} form={form} initialValues={{ ...props, password: isEditMode ? '******' : '' }}>
        <Form.Item name={'username'} label='用户名' rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder='请输入用户名...' disabled={isEditMode} />
        </Form.Item>
        <Form.Item name={'password'} label='密码' rules={[{ required: true, message: '请输入密码' }]}>
          <Input placeholder='请输入密码...' onFocus={() => checkPasswordVal()} onBlur={() => checkPasswordVal(false)} />
        </Form.Item>
        <Form.Item name={'phoneNumber'} label='手机号' rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
          <Input placeholder='请输入手机号...' disabled={isEditMode} />
        </Form.Item>
        <Form.Item name={'role'} label='角色'>
          <Select placeholder='请选择用户角色'>
            {Object.values(props.roleListMap).map((i: any) => (
              <Select.Option value={i.id}>{i.roleName}</Select.Option>
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
