/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:04:41
 * @LastEditTime: 2023-10-26 15:01:47
 * @Description: 测试视频
 */
import { Button, Table, Modal, message, Row } from 'antd';
import { useAntdTable } from 'ahooks';
import { useRef, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { getTestVideoList, getHotPicture, donwloadMoveMapData, downloadHotData } from '@/api/test-video';
import { getScreenInfo } from '@/api/common';
import { TNumberOrString } from '@/types/common.type';
import dayjs from 'dayjs';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { OperateType } from '@/types/operate.enum';
import { CustomPlay } from '@/components';
import { getExt, to, createMoveMap } from '@/utils/utils';
import { downloadFile } from '@/utils/download';
import { CustomSearch } from '@/components';
import DownloadOptionsTemplate from './download-options';
import JSZip from 'jszip';
import fileSaver from 'file-saver';

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
  const optionsRef = useRef<Record<string, any>>({});
  const [selectedArray, setSelectedArray] = useState<unknown[]>([]);

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    form: searchRef.current?.form
  });

  //  多选操作
  const rowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      setSelectedArray(selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      setSelectedArray(selectedRows);
    },
  }

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
      return hotPictureOperate(type, currentType!, data);
    }

    //  轨迹图操作
    return movePictureOperate(type, currentType!, data);
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

    const array = (currentType === TTestVideoType.HOT ? value.heatmapLink : value.heatmapVideoLink).split('?');
    const ext = getExt(array.length > 1 ? array[0] : array);
    const filename = `${currentType === TTestVideoType.HOT ? '' : '动态'}热力图_(问卷ID_${surveyId})-(问题ID_${questionId})-(用户ID_${userId})-(视频ID_${id}).${ext || ('jpg')}`;
    downloadFile(value.heatmapLink, filename).then(() => message.success('下载成功'));
  }

  /**
   * @desc 获取轨迹图数据进行操作
   * @param {OperateType} operateType 操作类
   * @param {TTestVideoType} currentType 当前数据类
   * @param {Record} data 单项数据体
   */
  const movePictureOperate = async (operateType: OperateType, currentType: TTestVideoType, data?: Record<string, any>) => {
    const receiveData = await getMovePointData(data!);

    if (!receiveData) {
      return;
    }

    const { indexList, rowPixel, columnPixel, statusBarHeight, questionFilePath } = receiveData;

    const container = document.createElement('div');

    createMoveMap({
      container,
      width: rowPixel || 1080,
      height: (columnPixel || 1670) - statusBarHeight,
      url: questionFilePath,
      data: indexList,
    })

    if (operateType === OperateType.DETAIL) {
      console.log(container);
      return Modal.confirm({
        title: '查看轨迹图',
        icon: null,
        maskClosable: false,
        closable: true,
        width: 800,
        footer: null,
        content: <div dangerouslySetInnerHTML={{ __html: container.outerHTML }}></div>,
      })
    }
  }

  //  获取轨迹图坐标基础数据
  const getMovePointData = async (data: Record<string, any>) => {
    const { session, questionFilePath, id } = data;
    if (!questionFilePath) {
      message.error(`暂无轨迹图数据`);
      return;
    }
    const result = await donwloadMoveMapData({ videoIds: [id] });
    if (
      !Array.isArray(result) ||
      (Array.isArray(result) && !result.length)
    ) {
      message.error("暂无轨迹图数据");
      return;
    }
    const _result: Record<string, any> = await getScreenInfo(session);

    const {
      rowPixel = 1080,
      columnPixel = 1670,
      statusBarHeight = 0,
    } = _result;
    return {
      indexList: result[0].indexList,
      rowPixel,
      columnPixel,
      statusBarHeight,
      questionFilePath,
    };
  };

  //  批量下载操作
  const moreDownloadOptions = async (currentType: TTestVideoType) => {
    Modal.confirm({
      title: `${currentType === TTestVideoType.HOT ? '热力图' : '轨迹图'}批量下载选项`,
      content: <DownloadOptionsTemplate ref={optionsRef} />,
      maskClosable: false,
      closeIcon: true,
      icon: null,
      width: 520,
      onOk: async () => {
        const { getValues } = optionsRef.current;
        const values = getValues();
        handleExportData(currentType, values);
      }
    })
  }

  //  导出操作
  const handleExportData = async (currentType: TTestVideoType, values: Record<string, any> = {}) => {
    const { createTime = [], surveyId, videoIds } = values;
    const params: Record<string, any> = {
      surveyId: `${surveyId}`,
      videoIds,
      createTime
    };
    if (Array.isArray(createTime) && createTime.length === 2) {
      const [startDate, endDate] = createTime;
      params.createTime = [
        `${dayjs(startDate).format("YYYY-MM-DDT00:00:00")}`,
        `${dayjs(endDate).format("YYYY-MM-DDT00:00:00")}`,
      ];
    }
    message.info(`正在导出数据中，请耐心等待...`);
    const [error, array] = await to(currentType === TTestVideoType.HOT ? downloadHotData(params) : donwloadMoveMapData(params));
    if (error) {
      message.destroy();
      return message.error(`导出失败，请联系管理员`);
    }

    if (!Array.isArray(array) || (Array.isArray(array) && !array.length)) {
      message.destroy();
      return message.error("暂无坐标数据");
    }

    if (Array.isArray(array)) {
      const zip = new JSZip();
      array.forEach(({ videoId, indexList, surveyId, userId, questionId }) => {
        if (!indexList) return;
        const newIndexList = indexList.map((item: { x: any; y: any; }, index: number) => {
          const { x, y } = item;
          return `${index + 1} ${x} ${y}`;
        });
        zip.file(
          `${currentType === TTestVideoType.HOT ? '热力图' : '轨迹图'}_(问卷ID_${surveyId})-(问题ID_${questionId})-(用户ID_${userId})-(视频ID_${videoId}).txt`,
          newIndexList.join("\n")
        );
      });
      zip.generateAsync({ type: "blob" }).then(function (content) {
        fileSaver.saveAs(content, `导出${currentType === TTestVideoType.HOT ? '热力图' : '轨迹图'}数据.zip`);
        message.destroy();
        message.success(`数据导出成功`);
      });
    } else {
      message.destroy();
      message.error(`数据异常，请联系管理员`);
    }
  }

  //  导出部分数据
  const exportChooseData = async (currentType: TTestVideoType) => {
    const videoIds = selectedArray.map((item: any) => item.id);
    const params = {
      createTime: [],
      surveyId: '',
      videoIds
    }
    handleExportData(currentType, params);
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
        <Button type='primary' className='mr-3 mb-3' onClick={() => moreDownloadOptions(TTestVideoType.HOT)}>批量下载热力图数据</Button>
        <Button type='primary' className='mr-3 mb-3' onClick={() => moreDownloadOptions(TTestVideoType.TRAJECTORY)}>批量下载轨迹图数据</Button>
        <Button className='mr-3 mb-3' disabled={selectedArray.length === 0} onClick={() => exportChooseData(TTestVideoType.HOT)}>导出选中热力图数据</Button>
        <Button className='mr-3 mb-3' disabled={selectedArray.length === 0} onClick={() => exportChooseData(TTestVideoType.TRAJECTORY)}>导出选中轨迹图数据</Button>
      </Row>
      <Table columns={columns} rowSelection={rowSelection} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </div>
  )
}

export default TestVideo;
