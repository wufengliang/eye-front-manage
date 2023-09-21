/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 15:10:18
 * @LastEditTime: 2023-09-21 16:27:07
 * @Description: 视频下载弹出层
 */
import { useState } from 'react';
import { Radio, DatePicker } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function DownloadVideoTemplate() {
  const [checked, setChecked] = useState<number>(0);
  const [date, setDate] = useState(null);
  const [selectUser, setSelectUser] = useState(0);

  return (
    <>
      <div className='my-2'><b>是否下载全部视频</b></div>
      <>
        <Radio.Group value={checked}>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      </>
      <div className='my-2'><b>时间范围选择</b></div>
      <>
        <DatePicker locale={zhCN} placeholder='请选择时间' value={date} />
      </>
      <div className='my-2'><b>是否选择指定用户视频下载</b></div>
      <>
        <Radio.Group value={selectUser}>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      </>
    </>
  )
}

export default DownloadVideoTemplate;
