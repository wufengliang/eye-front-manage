/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-09 11:27:55
 * @LastEditTime: 2023-10-17 17:29:21
 * @Description: 问卷答案
 */
import { Table, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { TNumberOrString } from '@/types/common.type';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { getQuestionAnswerList } from '@/api/question-answer';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getQuestionAnswerList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function QuestionAnswer() {
  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ]
  });

  const navigate = useNavigate();

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
        <Tag color={record.status === 0 ? 'red' : 'green'}>{record.status === 0 ? '正在回收' : '待投放'}</Tag>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DETAIL, record)}>查看所有用户</Button>
        </>
      )
    }
  ];

  const handleOperate = async (type: OperateType, data: unknown) => {
    switch (type) {
      case OperateType.DETAIL:
        return navigate(`/answerUser?id=${(data as Record<string, any>)?.id}`);
      default:
        return;
    }
  }

  const scrollXCount = useGetScrollCount(columns);

  return <div className='project-box'>
    <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
  </div>
}

export default QuestionAnswer;
