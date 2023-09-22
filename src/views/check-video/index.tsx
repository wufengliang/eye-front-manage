/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:01
 * @LastEditTime: 2023-09-22 17:24:35
 * @Description: 校准视频
 */
import { useAntdTable } from 'ahooks';
import { useRef } from 'react';
import { Button, Table, Modal } from 'antd';
import { getCheckVideoList } from '@/api/check-video';
import { TNumberOrString } from '@/types/common.type';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { useGetScrollCount, useTableProps } from '@/hooks';
import dayjs from 'dayjs';
import { CustomPlay, CustomSearch } from '@/components';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getCheckVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function CheckVideo() {
  //  表单组件
  const searchRef = useRef<Record<string, any>>({});

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    form: searchRef.current?.form
  });

  const columns: ColumnsType<any> = [
    { title: '视频ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '用户ID', dataIndex: 'userId', width: 150, },
    {
      title: '创建时间', dataIndex: 'createTime', width: 150, render: (_, record) => (
        <>{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.PLAY, record)}>点击播放</Button>
        </>
      )
    }
  ];

  const handleOperate = async (type: OperateType, data: unknown) => {
    if (type === OperateType.PLAY) {
      return Modal.confirm({
        title: '查看视频',
        icon: null,
        maskClosable: true,
        closable: true,
        content: <CustomPlay {...(data || {})} />,
        footer: null,
      })
    }
  }

  //  渲染搜索区域
  const renderSearch = () => (
    <div className='test-video-form mb-8'>
      <CustomSearch
        columns={[{ name: 'search', label: '校准视频', type: 'Input', defaultValue: '', placeholder: '请输入...' }]}
        loading={tableProps.loading}
        onSearch={() => search.submit()}
        onReset={() => search.reset()}
        ref={searchRef}
      />
    </div>
  )

  const scrollXCount = useGetScrollCount(columns);


  return <div className='project-box'>
    {renderSearch()}
    <>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </>
  </div>
}

export default CheckVideo;
