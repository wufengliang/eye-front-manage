
import { useRef, forwardRef, useImperativeHandle, Ref, useState } from 'react';
import { Form, Input } from 'antd';
import { IDownloadType } from '@/types/download.type';

function UploadTemplate(props = {}, ref?: Ref<unknown>) {

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  const [params, setParams] = useState<IDownloadType>({ fileName: '视觉评价系统移动端' })

  const form = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      validate() {
        return (form.current! as Record<string, any>).validateFields();
      }
    }
  })


  return (
    <>
      <Form {...layout} ref={form}>
        <Form.Item label='App名称'>
          <Input disabled value={params?.fileName} />
        </Form.Item>
        <Form.Item label='版本号' name='version' required>
          <Input placeholder='请输入版本号' />
        </Form.Item>
        <Form.Item label='上传文件' name='link' required>

        </Form.Item>
      </Form>
    </>
  )
}

export default forwardRef(UploadTemplate);
