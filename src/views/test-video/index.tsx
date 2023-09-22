/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:04:41
 * @LastEditTime: 2023-09-22 17:24:02
 * @Description: 测试视频
 */
import { Button, Table, Modal, message, Row } from 'antd';
import { useAntdTable } from 'ahooks';
import { useRef } from 'react';
import type { ColumnsType } from 'antd/es/table'
import { getTestVideoList, getHotPicture } from '@/api/test-video';
import { TNumberOrString } from '@/types/common.type';
import dayjs from 'dayjs';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { OperateType } from '@/types/operate.enum';
import { CustomPlay } from '@/components';
import { getExt, to } from '@/utils/utils';
import { downloadFile } from '@/utils/download';
import { CustomSearch } from '@/components';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getTestVideoList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

enum TTestVideoType {
  HOT,  //  热力图
  DYNAMIC_HOT,  //  动态热力图
  TRAJECTORY, //  轨迹
}

function TestVideo() {
  //  表单组件
  const searchRef = useRef<Record<string, any>>({});

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    form: searchRef.current?.form
  });

  //  缓存热力图数据
  const hotCacheData = useRef<Record<string, any>>({});

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
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.PLAY, record)}>点击播放</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DETAIL, record, TTestVideoType.HOT)}>查看热力图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DETAIL, record, TTestVideoType.TRAJECTORY)}>查看轨迹图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DOWNLOAD, record, TTestVideoType.HOT)}>下载热力图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DOWNLOAD, record, TTestVideoType.TRAJECTORY)}>下载轨迹图</Button>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.DOWNLOAD, record, TTestVideoType.DYNAMIC_HOT)}>下载动态热力图</Button>
        </>
      )
    }
  ];

  /**
   * @desc 操作方法付
   * @param type 当前操作句柄
   * @param data 数据源
   * @param currentType 二次类型定义
   */
  const handleOperate = async (type: OperateType, data?: Record<string, any>, currentType?: TTestVideoType) => {
    //  点击播放
    if (type === OperateType.PLAY) {
      return Modal.confirm({
        title: '查看视频',
        maskClosable: false,
        closable: true,
        icon: null,
        content: <CustomPlay {...data} />,
        footer: null,
      });
    }

    // 热力图查看详情、下载 + 下载动态热力图
    if ([OperateType.DETAIL, OperateType.DOWNLOAD].includes(type) && ([TTestVideoType.HOT, TTestVideoType.DYNAMIC_HOT].includes(currentType!))) {
      hotPictureOperate(type, currentType!, data);
    }
  }

  /**
   * @desc 获取热力图数据进行操作
   * @param {OperateType} operateType 操作类
   * @param {TTestVideoType} currentType 当前数据类
   * @param {Record} data 单项数据体
   */
  const hotPictureOperate = async (operateType: OperateType, currentType: TTestVideoType, data?: Record<string, any>) => {
    const { questionId, id, surveyId, userId } = data!;
    const tempValue = hotCacheData.current[id];
    if (typeof tempValue && tempValue !== null) {
      const [error, result] = await to(getHotPicture(id));
      const value = error ? null : result;
      hotCacheData.current[id] = value;
    }
    const value = hotCacheData.current[id];

    if (!value || !value.heatmapLink) {
      message.destroy();
      return message.error('暂无热力图数据');
    }

    if (operateType === OperateType.DETAIL) {
      return Modal.confirm({
        title: '查看热力图',
        maskClosable: false,
        closable: true,
        icon: null,
        width: 600,
        content: <img src={value.heatmapLink} width={'100%'} alt='热力图' />,
        footer: null,
      });
    }

    const ext = getExt((currentType === TTestVideoType.HOT ? value.heatmapLink : value.heatmapVideoLink).split('?'));
    const filename = `热力图_(问卷ID_${surveyId})-(问题ID_${questionId})-(用户ID_${userId})-(视频ID_${id}).${ext || ('jpg')}`;
    downloadFile(value.heatmapLink, filename).then(() => message.success('下载成功'));
  }

  const scrollXCount = useGetScrollCount(columns);

  //  渲染搜索区域
  const renderSearch = () => (
    <div className='test-video-form mb-8'>
      <CustomSearch
        columns={[{ name: 'search', label: '测试视频', type: 'Input', defaultValue: '', placeholder: '请输入...' }]}
        loading={tableProps.loading}
        onSearch={() => search.submit()}
        onReset={() => search.reset()}
        ref={searchRef}
      />
    </div>
  )

  return (
    <div className='test-video-box'>
      {renderSearch()}
      <Row className='mb-1 flex-wrap' justify={'end'}>
        <Button type='primary' className='mr-3 mb-3'>批量下载热力图数据</Button>
        <Button type='primary' className='mr-3 mb-3'>批量下载轨迹图数据</Button>
        <Button className='mr-3 mb-3'>导出选中热力图数据</Button>
        <Button className='mr-3 mb-3'>导出选中轨迹图数据</Button>
      </Row>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </div>
  )
}

export default TestVideo;
