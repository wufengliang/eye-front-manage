/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-28 17:23:51
 * @LastEditTime: 2023-10-28 17:41:04
 * @Description:
 */
import { forwardRef, useImperativeHandle, Ref, useRef, useEffect, useState } from 'react';
import { Button, Empty } from 'antd';
import { getProfileData } from '@/api/project';
import { to } from '@/utils/utils';

function BgTemplate(props: Record<string, any> = {}, ref?: Ref<unknown>) {

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, [])

  /**
   * @desc 获取数据
   */
  const getData = async () => {
    const { surveyId } = props;
    const [, result] = await to(getProfileData(surveyId));
    console.log(result);
  }

  /**
   * @desc 删除背景问题配置
   */
  const deleteConfig = async () => {

  }

  /**
   * @desc 渲染按钮
   */
  const renderData = () => {
    return (
      <>
        <Button type='primary' danger >删除背景问题配置</Button>
        <Button type='primary' danger>更新当前背景问题配置</Button>
      </>
    )
  }

  return (
    <div className='my-5'>
      {
        !(Array.isArray(dataSource)) || (Array.isArray(dataSource) && dataSource.length === 0) ?
          (
            <Empty description='暂无背景问题'>
              <Button type='primary'>新增背景问题配置</Button>
            </Empty>
          ) :
          renderData()
      }
    </div>
  )
}

export default forwardRef(BgTemplate);
