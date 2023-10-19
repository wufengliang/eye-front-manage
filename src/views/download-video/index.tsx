/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:41:01
 * @LastEditTime: 2023-10-19 14:03:07
 * @Description: 校准视频
 */
import { useAntdTable } from 'ahooks';
import { Button, Table, Modal, message } from 'antd';
import { useRef } from 'react';
import { getDownloadVideoList, downloadTestVideo, donwloadCheckVideo } from '@/api/download-video';
import { TNumberOrString } from '@/types/common.type';
import type { ColumnsType } from 'antd/es/table';
import { useGetScrollCount, useTableProps } from '@/hooks';
import DownloadVideoTemplate from './template';
import { CustomSearch } from '@/components';
import { to } from '@/utils/utils';
import dayjs from 'dayjs';
import JSZip from 'jszip';
import axios from 'axios';
import fileSaver from 'file-saver';

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
  const templateRef = useRef<unknown>(null);

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

  /**
   * @desc 按钮操作
   * @param type 操作类型
   * @param data 数据源
   */
  const handleOperate = async (type: VideoType, data: unknown) => {
    Modal.confirm({
      title: '下载参数设置',
      content: <DownloadVideoTemplate ref={templateRef} downloadAll={2} user={2} />,
      maskClosable: false,
      closable: true,
      icon: null,
      width: 600,
      onOk: async () => {
        const { validate, date } = templateRef.current as Record<string, any>;
        const [, result] = await to(validate());
        if (result) {
          const { downloadAll, user, } = result;
          if (downloadAll === 2 && !!!date) {
            message.error(`请选择时间范围`);
            return Promise.reject(`请选择日期`);
          }
          let params: Record<string, any> = { surveyId: (data as Record<string, any>)?.id };

          if (downloadAll === 2) {
            params['startTime'] = dayjs(date[0]).format('YYYY-MM-DD 00:00:00');
            params['endTime'] = dayjs(date[1]).format('YYYY-MM-DD 00:00:00');
          }
          const [, value] = await to(type === VideoType.TEST_VIDEO ? downloadTestVideo(params) : donwloadCheckVideo(params));
          if (value) {
            if (!Array.isArray(value.result) || (Array.isArray(value.result) && value.result.length === 0)) {
              return message.error(type === VideoType.TEST_VIDEO ? `该问卷没有测试视频` : `该问卷没有校准视频`);
            }
            downloadData(type, data, value.result);
          }
        }
      }
    })
  }

  /**
   * @desc 导出数据
   * @param type 操作类型
   * @param data 数据源
   * @param value 需要导出的数据源
   */
  const downloadData = async (type: VideoType, data: unknown, value: Array<any>) => {
    message.info(`正在导出数据中，请耐心等待...`);
    const zip = new JSZip();
    const folderName = type === VideoType.TEST_VIDEO ? 'test_video' : 'pre_video';
    const videoFolder = zip.folder(folderName);
    zip.file('relationship.json', handleRelationText(value, folderName));
    let errorIndex = 0;
    axios.all(value.map((item: any) => {
      return getFile(item.videoPath).then((result: any) => {
        if (result) {
          const splitArr = item.videoPath.split('/');
          const hasTypeIndex = splitArr.findIndex((ele: any) => ele.indexOf('.mp4') !== -1);
          let fileName = '';
          for (let i = 4; i < hasTypeIndex; i++) {
            fileName += `${splitArr[i]}/`;
          }
          fileName += `${splitArr[hasTypeIndex].split('?')[0]}`;
          videoFolder!.file(fileName, result, { binary: true });
        } else {
          errorIndex++;
        }
      }).then(() => {
        axios.spread(() => {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            fileSaver.saveAs(content, '视频资料.zip');
            message.success(`视频下载成功，${errorIndex > 0 ? '其中有视频下载失败' : '无视频下载失败'}`);
          })
        })
      })
    }))
  }

  /**
   * @desc 处理下载关系
   * @returns {String} 文本内容
   */
  const handleRelationText = (value: Array<any>, folderName: string) => {
    return JSON.stringify(value.reduce((prev, next) => {
      const tempIndex = prev.findIndex((ele: any) => ele.userId === next.userId);
      const urlFix = next.videoPath.split('?')[0].split('/');
      const splitVideo = urlFix[urlFix.length - 1];
      const addContent = {
        [`${folderName}_path`]: splitVideo, surveyId: next.surveyId, questionId: next.questionId, rowPixel: next.rowPixel, columnPixel: next.columnPixel
      }
      if (tempIndex !== -1) {
        prev[tempIndex].surveyId = next.surveyId
        prev[tempIndex][`${folderName}_path_arr`].push(addContent)
      } else {
        prev.push({ userId: next.userId, [`${folderName}_path_arr`]: [addContent] })
      }
      return prev
    }, []));
  }

  /**
   * @desc 获取文件流
   * @param url 文件url
   * @returns {Promise}
   */
  const getFile = (url: string) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
      })
        .then(({ data }) => {
          resolve(data)
        })
        .catch(() => {
          resolve(0)
        });
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
