/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 11:53:36
 * @LastEditTime: 2023-10-26 14:47:41
 * @Description: 上传管理
 */
import { Button, Modal, message } from 'antd';
import { useRef } from 'react';
import UploadTemplate from './template';
import { to } from '@/utils/utils';
import { uploadFile } from '@/api/upload';

function Upload() {

  const modalRef = useRef<Record<string, () => Promise<any>>>(null);

  const openDialog = () => {
    Modal.confirm({
      title: 'App上传',
      content: <UploadTemplate ref={modalRef} />,
      maskClosable: false,
      width: 520,
      closable: true,
      icon: null,
      onOk: async () => {
        const { validate } = modalRef.current!;
        const [error, result] = await to(validate());
        if (!result) {
          return Promise.reject(error);
        }
        const [err] = await to(uploadFile(result));
        err ? message.error(`保存失败`) : message.success('上传成功');
      }
    })
  }

  return (
    <div className='upload-box'>
      <Button type='primary' onClick={() => openDialog()}>上传APK</Button>
    </div>
  )
}

export default Upload;
