/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-19 14:16:14
 * @LastEditTime: 2023-09-19 15:08:24
 * @Description: 通用播放器
 */
import { message } from 'antd';

function CustomPlay(options: Record<string, any>) {
  return (
    <div style={{ minHeight: '50vh' }}>
      <video controls width={'100%'} onError={() => {
        message.error({ content: '获取视频资源失败', duration: 1 });
      }}>
        <source src={options.videoPath}></source>
      </video>
    </div>
  )
}

export default CustomPlay;
