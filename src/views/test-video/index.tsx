/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:04:41
 * @LastEditTime: 2023-09-13 17:33:57
 * @Description: 测试视频
 */
import { Button, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table'
import { getTestVideoList } from '@/api/test-video';
import { TNumberOrString } from '@/types/common.type';
import dayjs from 'dayjs';
import { useGetScrollCount } from '@/hooks';
import { OperateType } from '@/types/operate.enum';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getTestVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function TestVideo() {
  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ]
  });

  const columns: ColumnsType<any> = [
    { title: '视频ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷ID', dataIndex: 'surveyId', width: 150, },
    { title: '问题ID', dataIndex: 'questionId', width: 150, },
    { title: '用户ID', dataIndex: 'userId', width: 150, },
    {
      title: '创建时间', dataIndex: 'createTime', width: 150, render: (_, record) => (
        <>{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>点击播放</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>查看热力图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>查看轨迹图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>下载轨迹图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>下载热力图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>下载动态热力图</Button>
        </>
      )
    }
  ];

  const handleOperate = (type: OperateType, data?: Record<string, any>) => {

  }

  const scrollXCount = useGetScrollCount(columns);

  return (
    <div className='test-video-box'>
      <div className='flex justify-end mb-3'>
        <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加用户</Button>
      </div>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...tableProps} />
    </div>
  )
}

export default TestVideo;
