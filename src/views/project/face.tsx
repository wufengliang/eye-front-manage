/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-23 10:07:21
 * @LastEditTime: 2023-10-26 13:58:09
 * @Description: 人脸识别示范管理
 */
import { useEffect, useState } from 'react';
import { Upload, Spin, Modal, message } from 'antd';
import { getShowFaceList, deleteFaceItem } from '@/api/project';
import { getImgFileUrl, uploadFile } from '@/api/common';
import { to } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';

function FaceTemplate() {

  const [array, setArray] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    setLoading(true);
    const [, result] = await to(getShowFaceList());
    if (result) {
      const [, values] = await to(Promise.all(result.map((item: { id: string }) => getImgFileUrl(item.id))));
      setArray(() => {
        if (!Array.isArray(values)) {
          return [];
        }
        return values.map((item: Record<string, any>) => {
          const { rawData, downloadLink: url } = item;
          const { id: uid, fileName: name } = rawData;
          return { url, uid, name };
        })
      })
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100px' }}>
      <Spin tip='正在加载数据中...' spinning={loading}>
        <Upload
          listType={'picture-card'}
          fileList={array}
          beforeUpload={() => false}
          onChange={async (event) => {
            const { name: fileName, type, status } = event.file;
            console.log(event.file);
            if (!!!status) {
              const [, result] = await to(uploadFile({ file: event.file, contentType: type!, fileName, urlPath: '/admin/face', expireTime: 10000 }));
              result && getData();
            }
          }}
          onPreview={(file) => {
            Modal.info({
              icon: null,
              title: '预览',
              content: <img src={file.url} width={'100%'} alt='预览图' />,
              maskClosable: false,
              closable: true,
              footer: null,
            })
          }}
          onRemove={(file) => {
            Modal.confirm({
              title: '提示',
              content: '确认是否删除当前人脸识别示范图片?',
              maskClosable: false,
              onOk: async () => {
                const [error] = await to(deleteFaceItem(file.uid));
                if (error) {
                  return Promise.resolve(false);
                }
                message.success('删除成功');
                setArray(array.filter(item => item.uid !== file.uid));
              }
            })
          }}> <PlusOutlined /></Upload>
      </Spin>
    </div>
  )
}

export default FaceTemplate;
