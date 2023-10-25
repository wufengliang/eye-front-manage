/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-09 11:27:55
 * @LastEditTime: 2023-10-23 15:48:45
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
import dayjs from 'dayjs';
import { CustomSearch } from '@/components';
import { useRef } from 'react';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getQuestionAnswerList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function QuestionAnswer() {

  const searchRef = useRef<Record<string, any>>({});

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    form: searchRef.current?.form
  });

  const navigate = useNavigate();

  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    { title: '问卷开始语简介', dataIndex: 'startTips', width: 150, },
    { title: '问卷结束语简介', dataIndex: 'endTips', width: 170, },
    {
      title: '投放开始时间',
      dataIndex: 'startTime',
      width: 200,
      render: (_, record) => {
        return (
          <>
            {dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss')}
          </>
        )
      }
    },
    {
      title: '投放结束时间',
      dataIndex: 'endTime',
      width: 200,
      render: (_, record) => {
        return (
          <>
            {dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss')}
          </>
        )
      }
    },
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

  //  渲染搜索区域
  const renderSearch = () => (
    <div className='test-video-form mb-8'>
      <CustomSearch
        columns={[{ name: 'search', label: '问卷标题', type: 'Input', defaultValue: '', placeholder: '请输入...' }]}
        loading={tableProps.loading}
        onSearch={() => search.submit()}
        onReset={() => search.reset()}
        ref={searchRef}
      />
    </div>
  )

  return (
    <div className='project-box'>
      {renderSearch()}
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </div>
  )
}

export default QuestionAnswer;
