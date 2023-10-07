/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:01
 * @LastEditTime: 2023-09-23 11:54:05
 * @Description: 校准视频
 */
import { useAntdTable } from 'ahooks';
import { Button, Table, Modal } from 'antd';
import { useRef } from 'react';
import { getDownloadVideoList } from '@/api/download-video';
import { TNumberOrString } from '@/types/common.type';
import type { ColumnsType } from 'antd/es/table';
import { useGetScrollCount, useTableProps } from '@/hooks';
import DownloadVideoTemplate from './template';
import { CustomSearch } from '@/components';

enum VideoType {
  TEST_VIDEO,
  CHECK_VIDEO,
}

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getDownloadVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function DownloadVideo() {
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
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(VideoType.TEST_VIDEO, record)}>下载测试视频</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(VideoType.CHECK_VIDEO, record)}>下载校准视频</Button>
        </>
      )
    }
  ];

  const handleOperate = async (type: VideoType, data: unknown) => {
    Modal.confirm({
      title: '下载参数设置',
      content: <DownloadVideoTemplate />,
      maskClosable: false,
      closable: true,
      icon: null,
    })
  }

  //  渲染搜索区域
  const renderSearch = () => (
    <div className='test-video-form mb-8'>
      <CustomSearch
        columns={[{ name: 'search', label: '问卷', type: 'Input', defaultValue: '', placeholder: '请输入...' }]}
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
    <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
  </div>
}

export default DownloadVideo;
