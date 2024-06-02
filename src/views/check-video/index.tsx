/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:01
 * @LastEditTime: 2024-05-30 16:47:31
 * @Description: 校准视频
 */
import { useAntdTable } from 'ahooks';
import { useRef } from 'react';
import { Button, Table, Modal, DatePicker } from 'antd';
import { getCheckVideoList } from '@/api/check-video';
import { TNumberOrString } from '@/types/common.type';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { useGetScrollCount, useTableProps } from '@/hooks';
import dayjs from 'dayjs';
import { CustomPlay, CustomSearch } from '@/components';
import { useSelector } from 'react-redux';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getCheckVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function CheckVideo() {
  const { userInfo } = useSelector((state: Record<string, any>) => state.user);
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
          {/* {userInfo.role === 1 && <Button type='primary' className='margin-right-10 margin-bottom-5' danger onClick={() => handleOperate(OperateType.DELETE, record)}>删除</Button>} */}
        </>
      )
    }
  ];

  const handleOperate = async (type: OperateType, data?: Record<string, any>) => {
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

    //  删除视频
    if (type === OperateType.DELETE) {
      return Modal.confirm({
        title: '删除视频',
        maskClosable: false,
        closable: true,
        content: `确认删除问卷ID为【${data?.surveyId}】的校准视频吗？`,
        onOk: async () => { }
      })
    }
  }

  //  渲染搜索区域
  const renderSearch = () => (
    <div className='test-video-form mb-8'>
      <CustomSearch
        columns={[
          { name: 'search', label: '校准视频', type: 'Input', defaultValue: '', placeholder: '请输入...' },
          { name: 'createTime', label: '时间段', placeholder: '请输入时间段', customNode: <DatePicker.RangePicker className='margin-top-5' style={{ width: '100%' }} /> }
        ]}
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
