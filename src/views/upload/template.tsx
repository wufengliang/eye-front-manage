/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-07 19:49:19
 * @LastEditTime: 2023-10-26 14:41:01
 * @Description:
 */

import { forwardRef, useImperativeHandle, Ref, useState } from 'react';
import { Form, Input } from 'antd';
import { CustomUpload } from '@/components';
import { IDownloadType } from '@/types/download.type';

function UploadTemplate(props = {}, ref?: Ref<unknown>) {

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  const [params, setParams] = useState<IDownloadType>({ fileName: '视觉评价系统移动端', version: '', link: '' })

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
      <Form {...layout} form={form} initialValues={Object.assign(params, props)}>
        <Form.Item label='App名称' name='fileName' rules={[{ required: true, message: '请输入App版本名称' }]}>
          <Input placeholder='请输入App名称' />
        </Form.Item>
        <Form.Item label='版本号' name='version' rules={[{ required: true, message: '请输入版本号' }]}>
          <Input placeholder='请输入版本号' />
        </Form.Item>
        <Form.Item label='上传文件' name='link' rules={[{ required: true, message: '请上传文件' }]}>
          <CustomUpload urlPath='/admin/release' accept=".apk" maxCount={1} />
        </Form.Item>
      </Form>
    </>
  )
}

export default forwardRef(UploadTemplate);
