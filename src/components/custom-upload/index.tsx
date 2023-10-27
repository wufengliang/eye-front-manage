/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-07 19:59:36
 * @LastEditTime: 2023-10-27 17:20:30
 * @Description: 自定义上传文件
 */
import { Upload, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getImgFileUrl, uploadFile } from '@/api/common';
import { to } from '@/utils/utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadListType } from 'antd/es/upload/interface';

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
        onPreview={props.onPreview}
        onRemove={props.onRemove}
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
