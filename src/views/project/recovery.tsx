/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-22 15:27:54
 * @LastEditTime: 2023-09-22 16:49:03
 * @Description:
 */
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAntdTable, useRequest } from 'ahooks';
import { getRecoveryList, updateProjectData } from '@/api/project';
import { TNumberOrString } from '@/types/common.type';
import { useGetScrollCount } from '@/hooks';
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
import { OperateType } from '@/types/operate.enum';
import { to } from '@/utils/utils';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getRecoveryList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function RecoveryTemplate() {
  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    { title: '问卷开始语简介', dataIndex: 'startTips', width: 150, },
    { title: '问卷结束语简介', dataIndex: 'endTips', width: 170, },
    {
      title: '投放开始时间',
      dataIndex: 'startTime',
      width: 180,
      render: (_, record) => (
        <>{dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '投放结束时间',
      dataIndex: 'endTime',
      width: 180,
      render: (_, record) => (
        <>{dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type='primary' onClick={() => run(OperateType.RESTORE, record.id)}>恢复</Button>
      )
    }
  ];

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' },
    ],
  });

  /**
   * @desc 恢复操作
   */
  const handleOperate = async (type: OperateType, data: unknown) => {
    const [error] = await to(updateProjectData(data as string));
    !!!error && search.reset();
  }

  const { loading, run } = useRequest(handleOperate, { manual: true });

  const scrollXCount = useGetScrollCount(columns);


  return (
    <div className='overflow-y-auto'>
      <Table {...tableProps} loading={loading} pagination={{ ...tableProps.pagination, locale: zhCN.Pagination }} scroll={{ x: scrollXCount }} bordered columns={columns} rowKey={'id'}></Table>
    </div>
  )
}

export default RecoveryTemplate;
