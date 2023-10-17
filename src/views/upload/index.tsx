/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 11:53:36
 * @LastEditTime: 2023-10-07 20:03:51
 * @Description: 上传管理
 */
import { Button, Modal } from 'antd';
import UploadTemplate from './template';

function Upload() {

  const openDialog = () => {
    Modal.confirm({
      title: 'App上传',
      content: <UploadTemplate />,
      maskClosable: false,
      width: 520,
      closable: true,
      icon: null,
    })
  }

  return (
    <div className='upload-box'>
      <Button type='primary' onClick={() => openDialog()}>上传APK</Button>
    </div>
  )
}

export default Upload;
