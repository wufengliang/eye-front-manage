/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-09 11:27:55
 * @LastEditTime: 2023-09-21 16:42:30
 * @Description: 项目管理
 */
import { Table, Button } from 'antd';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { TNumberOrString } from '@/types/common.type';
import { useGetScrollCount } from '@/hooks';
import { getProjectList } from '@/api/project';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getProjectList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function ProjectManage() {
  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ]
  });

  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    { title: '问卷开始语简介', dataIndex: 'startTips', width: 150, },
    { title: '问卷结束语简介', dataIndex: 'endTips', width: 170, },
    { title: '投放开始时间', dataIndex: 'startTime', width: 150, },
    { title: '投放结束时间', dataIndex: 'endTime', width: 150, },
    {
      title: '问卷状态',
      dataIndex: 'status',
      width: 150,
      render: (_, record) => (
        <>{record.status === 0 ? '正在回收' : '待投放'}</>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-bottom-10' onClick={() => handleOperate(OperateType.DETAIL, record)}>查看详情</Button>
          <Button type='primary' danger onClick={() => handleOperate(OperateType.DELETE, record)}>删除</Button>
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

export default ProjectManage;
