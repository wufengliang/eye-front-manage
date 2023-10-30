/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-07 19:59:36
 * @LastEditTime: 2023-10-30 15:35:53
 * @Description: 自定义上传文件
 */
import { Upload, Modal, message } from 'antd';
import { useState } from 'react';
import { uploadFile } from '@/api/common';
import { to } from '@/utils/utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadFile, UploadListType } from 'antd/es/upload/interface';
import { getExt } from '@/utils/utils';

interface IUploadOptions {
  dataSource?: any[];
  onPreview?: (...args: any[]) => void;
  onRemove?: (...args: any[]) => void;
  listType?: UploadListType;
  accept?: string;
  urlPath: string;
  onChange?: (...args: any[]) => void;
  expireTime?: number;
  maxCount?: number;
}

const setData = (array?: any[]): any[] => {
  if (!array) return [];
  if (Array.isArray(array)) {
    return array.map(item => ({ url: item?.url ?? item, status: 'done' }))
  }

  return [array].map((item: Record<string, any>) => ({ url: item.url ?? item, status: 'done' }))
}

function CustomUpload(props: IUploadOptions) {
  const [array, setArray] = useState<any[]>(setData(props.dataSource))

  const [loading, setLoading] = useState<boolean>(false);

  const remove = async (file: UploadFile<any>) => {
    if (!props.maxCount || props.maxCount === 1) {
      props.onChange?.([]);
      return setArray([]);
    }

    const newArray = [...array];
    const index = newArray.findIndex(item => item.url === file.url);

    if (index >= 0) {
      newArray.splice(index, 1);
    }
    props.onChange?.(newArray);
    return setArray(newArray);
  }

  const preview = async (file: UploadFile<any>) => {
    if (typeof props.onPreview === 'function') {
      return;
    }

    const ext = getExt(file.url!);
    const component = ['mp4', 'webm', 'ogg'].includes(ext!) ?
      'video' :
      (['jpg', 'jpeg', 'png', 'gif'].includes(ext!) ?
        'img' : (['mp3', 'wav', 'ogg'].includes(ext!) ? 'audio' : null));

    if (!component) {
      message.error(`当前文件后缀名为${ext}，请联系管理员处理`);
      return;
    }

    Modal.info({
      title: '预览',
      icon: null,
      content: component === 'img' ?
        <img src={file?.url} width={300} alt='预览资源' /> :
        (component === 'audio' ?
          <audio src={file?.url} style={{ width: `300px` }} controls /> :
          <video src={file?.url} width={300} controls />),
      maskClosable: false,
      closable: true,
      footer: null,
    })
  }

  return (
    <>
      <Upload
        listType={props.listType || 'picture-card'}
        fileList={array}
        maxCount={props.maxCount}
        accept={props.accept}
        beforeUpload={() => false}
        onChange={async (event) => {
          if (loading) {
            return;
          }
          setLoading(true);
          const { name: fileName, status, type } = event.file;
          if (!!!status) {
            const [, result] = await to(uploadFile({ file: event.file, contentType: type!, fileName, urlPath: props.urlPath, expireTime: props.expireTime ?? 10000 }));
            if (result) {
              const { downloadLink } = result;
              const newArray = [...array, { name: event.file.name, url: downloadLink, status: 'done' }];
              setArray(newArray);
              props.onChange?.((props.maxCount ?? 1) > 1 ? newArray : newArray[0].url);
            }
          }
          setLoading(false);
        }}
        onPreview={preview}
        onRemove={remove}
      >
        {loading ? (
          <div className='flex flex-col items-center justify-center'>
            <p>正在上传中...</p>
            <LoadingOutlined />
          </div>) : (array.length < (props.maxCount ?? 1) ? <PlusOutlined /> : null)
        }
      </Upload>
    </>
  )
}

export default CustomUpload;
