/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-29 23:38:30
 * @LastEditTime: 2024-05-30 00:43:05
 * @Description:
 */
import { Ref, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Input, InputNumber } from 'antd';
import TreeTemplate from './tree';
import { pick } from 'lodash-es';

function RoleTemplate(props: Record<string, any> = { limitedViewDay: 30, roleName: '', treeValue: [], treeData: [], checkable: true, permissionIds: [] }, ref?: Ref<unknown>) {
  const [form] = Form.useForm();
  const permissionIds = useRef<Array<string | number>>(props.treeValue);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  useImperativeHandle(ref, () => {
    return {
      validate() {
        return new Promise((resolve, reject) => {
          form
            .validateFields()
            .then(v => {
              resolve({ ...v, permissionIds: permissionIds.current.filter(i => typeof i !== 'string') })
            })
            .catch(() => {
              reject()
            })
        });
      }
    }
  }, []);

  return (
    <>
      <Form {...layout} form={form} initialValues={{ limitedViewDay: 30, ...pick(props, ['limitedViewDay', 'roleName', 'permissionIds']) }}>
        <Form.Item label='角色名称' name='roleName' rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='报表数据可视天数' name='limitedViewDay' rules={[{ required: true, message: '请输入报表数据可视天数' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label='权限列表' valuePropName='checkedKeys'>
          <TreeTemplate value={props.treeValue} treeData={props.treeData} checkable onChange={v => permissionIds.current = v} />
        </Form.Item>
      </Form >
    </>
  )
}

export default forwardRef(RoleTemplate);
