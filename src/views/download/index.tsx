/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-05 15:30:18
 * @LastEditTime: 2023-10-26 11:17:48
 * @Description: 下载界面
 */
import { useEffect, useState } from 'react';
import { Input, Button, QRCode, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getReleaseAppInfo } from '@/api/donwload';
import { to } from '@/utils/utils';
import { IDownloadType } from '@/types/download.type';
import { downloadFile } from '@/utils/download';
import './index.scss'

function Download() {
  const [config, setConfig] = useState<IDownloadType>({});

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const [, result] = await to(getReleaseAppInfo());
    if (result) {
      setConfig(result);
    }
  }

  //    下载apk
  const downloadApp = () => {
    message.info(`正在下载中，请耐心等待...`);
    downloadFile(config.link!, `${config.fileName}.apk`)
      .then(() => {
        message.success(`下载成功`);
      });
  };

  return (
    <div className='download-box flex items-center justify-center w-full h-full'>
      <div className="download-box__main">
        <h3 className='text-center margin-bottom-30 font-18'>AI视觉评价系统移动端下载</h3>
        <h4 className='text-center font-16 margin-bottom-30'>目前仅支持安卓系统</h4>
        <div className="flex items-center justify-center margin-bottom-18">
          <div className='font-14 w-20'>手机版下载</div>
          <Input disabled className='w-44 margin-right-5' value={config?.link} />
          <CopyToClipboard text={config.link!}
            onCopy={() => {
              message.success('复制成功');
            }}>
            <Button>复制</Button>
          </CopyToClipboard>
        </div>
        <div className="flex items-center justify-center margin-bottom-28">
          <div className='font-14 w-20'>Pad版下载</div>
          <Input disabled className='w-44 margin-right-5' value={config?.link} />
          <CopyToClipboard text={config.link!}
            onCopy={() => {
              message.success('复制成功');
            }}>
            <Button>复制</Button>
          </CopyToClipboard>
        </div>
        <div className="flex items-center justify-center margin-bottom-28">
          <QRCode value={config.link!} />
          <QRCode value={config.link!} className='margin-left-10' />
        </div>
        <div className="flex items-center justify-center margin-bottom-18">
          <Button type='primary'
            className='bg-[#1677ff] hover:bg-[#1677ff]'
            icon={<DownloadOutlined />}
            onClick={() => downloadApp()}
          >手机端下载</Button>
          <Button
            type='primary'
            className='margin-left-12 bg-[#1677ff] hover:bg-[#1677ff]'
            icon={<DownloadOutlined />}
            onClick={() => downloadApp()}
          >Pad版下载</Button>
        </div>
        <div className="flex items-center justify-center margin-bottom-18 font-14">
          提示：若无法下载，请复制链接到浏览器下载
        </div>
      </div>
    </div>
  )
}

export default Download;
