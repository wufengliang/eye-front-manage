/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:01
 * @LastEditTime: 2023-09-13 17:04:49
 * @Description: 校准视频
 */
import { useAntdTable } from 'ahooks';
import { Button, Table, } from 'antd';
import { getDownloadVideoList } from '@/api/download-video';
import { TNumberOrString } from '@/types/common.type';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { useGetScrollCount } from '@/hooks';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getDownloadVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function DownloadVideo() {
  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ]
  });

  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>下载测试视频</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>下载校准视频</Button>
        </>
      )
    }
  ];

  const handleOperate = async (type: OperateType, data: unknown) => {

  }

  const scrollXCount = useGetScrollCount(columns);

  const renderTable = () => {
    return <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...tableProps} />
  }

  return <div className='project-box'>
    {renderTable()}
  </div>
}

export default DownloadVideo;
