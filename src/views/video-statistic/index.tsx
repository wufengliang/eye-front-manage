/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-19 15:22:00
 * @LastEditTime: 2023-10-30 21:08:56
 * @Description: 视频统计
 */
import { Row, Col, DatePicker, Table, message } from 'antd';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { getTotalVideoStatistic } from '@/api/video-statistic';
import { getDownloadVideoList } from '@/api/download-video';
import { to } from '@/utils/utils';
import G2 from '@antv/g2';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import { TNumberOrString } from '@/types/common.type';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useGetScrollCount } from '@/hooks';

const getList = (params: { current: TNumberOrString, pageSize: TNumberOrString, }): Promise<any> => {
  return getDownloadVideoList({ page: params.current, size: params.pageSize, }).then(result => result);
}

function VideoStatistic() {

  const { tableProps } = useAntdTable(getList, {
    defaultParams: [
      { current: 1, pageSize: 10, },
    ],
  });

  const [time, setTime] = useState<Array<any> | null>([]);

  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 80, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    { title: '投放开始时间', dataIndex: 'createTime', width: 150, render: (_, record) => <>{dayjs(record?.createTime).format('YYYY-MM-DD HH:mm:ss')}</> },
    { title: '投放结束时间', dataIndex: 'endTime', width: 150, render: (_, record) => <>{dayjs(record?.createTime).format('YYYY-MM-DD HH:mm:ss')}</> },

  ];

  const [dataSource, setDataSource] = useState<Record<string, any>>({});
  const [surveyList, setSurveyList] = useState<any[]>([]);
  const selectItem = useRef<Record<string, any>>({ surveyId: '', startTime: null, endTime: null });

  //  多选操作
  const rowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      selectItem.current = { ...selectItem.current, surveyId: record?.id };
    },
    type: 'radio'
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSurveyLine();
  }, [surveyList])

  /**
   * @desc 获取数据
   */
  const getData = async (value?: Record<string, any>) => {
    const [, result] = await to(getTotalVideoStatistic(value));
    if (result) {
      setDataSource(result);
      setFoldLine(result);
      setSurveyList(result?.weekStatistic);
    }
  }

  /**
   * @desc 设置折线图
   */
  const setFoldLine = async (value: Record<string, any>) => {
    const node = document.querySelector('#fold-line-box');
    while (node?.firstChild) {
      node.removeChild(node?.firstChild);
    }
    const { weekQuestionNum, weekAverageTime, weekFinishNum } = value;
    const array = [
      { value: weekQuestionNum, label: '题目数量' },
      { value: weekFinishNum, label: '完成人数' },
      { value: weekAverageTime, label: '平均完成时间' },
    ];

    const TICKS = ['题目数量', '完成人数', '平均完成时间'];
    const chart = new G2.Chart({
      container: 'fold-line-box',
      forceFit: true,
      height: 400,
    });

    chart.source(array, {
      date: {
        ticks: TICKS
      }
    });
    chart.legend(false);
    chart.axis('value', {
      label: {
        textStyle: {
          fill: '#aaa'
        }
      }
    });
    chart.axis('label', {
      label: {
        textStyle: {
          fill: '#aaaaaa'
        }
      }
    });

    chart.point().position('label*value').size('label', (val: string) => {
      return TICKS.includes(val) ? 3 : 0;
    })
    chart.line().position('label*value');
    chart.render();
  }

  /**
   * @desc 设置问卷的折线图
   */
  const setSurveyLine = async () => {
    const dom = document.getElementById('survey-box')!;
    if (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
    const chart = new G2.Chart({
      container: 'survey-box',
      forceFit: true,
      height: 400,
    });

    chart.source(surveyList);
    chart.axis('startTime', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
        formatter(text, item, index) {
          return dayjs(text).format('YYYY-MM-DD');
        },
      }
    });

    chart.axis('account', {
      label: {
        textStyle: {
          fill: '#aaa'
        }
      }
    });
    chart.line().position('startTime*account');
    chart.point().position('startTime*account').size(3);
    chart.render();
  }

  const renderBox = (options: { title: string, children?: ReactNode, style?: any } = { title: '', children: null, style: {} }) => {
    const { title, children, style } = options;
    return (
      <div className="box mx-2" style={Object.assign({}, { border: '1px solid #e8e8e8' }, { ...(style || {}) })}>
        <h3 className='pl-5'>{title}</h3>
        {children ? children : null}
      </div >
    )
  }

  const scrollXCount = useGetScrollCount(columns);

  return (
    <>
      <Row>
        <Col span={12}>
          <div>
            {renderBox({
              title: "总体问卷完成情况统计数据",
              style: {
                height: '460px',
              },
              children: (
                <Row gutter={15}>
                  <Col span={8} className='text-center'>
                    <p>该问卷的题目数量</p>
                    <p className='text-blue-500'>
                      <span className='text-2xl'>{dataSource?.weekQuestionNum}</span>
                      <span>道</span>
                    </p>
                  </Col>
                  <Col span={8} className='text-center'>
                    <p>该问卷的完成人数</p>
                    <p className='text-blue-500'>
                      <span className='text-2xl'>{dataSource?.weekFinishNum}</span>
                      <span>人</span>
                    </p>
                  </Col>
                  <Col span={8} className='text-center'>
                    <p>该问卷的平均完成时间</p>
                    <p className='text-blue-500'>
                      <span className='text-2xl'>{dataSource?.weekAverageTime}</span>
                      <span>秒</span>
                    </p>
                  </Col>
                </Row>
              )
            })}
          </div>

          <div className='my-5'>
            {renderBox({
              title: '日期时间选择',
              children: (
                <div className='m-5'>
                  <DatePicker.RangePicker
                    locale={zhCN}
                    style={{ width: `100%` }}
                    value={time as any}
                    onChange={v => {
                      if (!!!selectItem.current.surveyId) {
                        return message.error(`请选择问卷`);
                      }
                      if (!v) {
                        return;
                      }
                      const [startDate, endDate] = v as Array<any>;
                      selectItem.current = {
                        ...selectItem.current,
                        startTime: dayjs(startDate).format('YYYY-MM-DD 00:00:00'),
                        endTime: dayjs(endDate).format('YYYY-MM-DD 00:00:00')
                      }
                      getData(selectItem.current);
                      setTime(v);
                    }}
                  />
                </div>
              )
            })}
          </div>

          <div className="my-5">
            {renderBox({
              title: '问卷选择',
              children: (
                <div className='mx-5'>
                  <Table scroll={{ x: scrollXCount }} rowSelection={rowSelection as any} columns={columns} bordered rowKey='id' {...tableProps} />
                </div>
              )
            })}
          </div>
        </Col>
        <Col span={12}>
          {renderBox({
            title: '总体问卷完成情况统计折线图',
            children: <div id='fold-line-box'></div>
          })}

          <div className="my-5">
            {renderBox({
              title: '选择的问卷完成人数统计',
              children: <div id='survey-box'></div>
            })}
          </div>

          <div className="my-5">
            {renderBox({
              title: '选中的问卷完成情况统计数据',
              children: (
                <>
                  <Row gutter={15}>
                    <Col span={8} className='text-center'>
                      <p>该问卷的题目数量</p>
                      <p className='text-blue-500'>
                        <span className='text-2xl'>{dataSource?.questionNum || 0}</span>
                        <span>道</span>
                      </p>
                    </Col>
                    <Col span={8} className='text-center'>
                      <p>该问卷的完成人数</p>
                      <p className='text-blue-500'>
                        <span className='text-2xl'>{dataSource?.finishNum || 0}</span>
                        <span>人</span>
                      </p>
                    </Col>
                    <Col span={8} className='text-center'>
                      <p>该问卷的平均完成时间</p>
                      <p className='text-blue-500'>
                        <span className='text-2xl'>{dataSource?.averageTime || 0}</span>
                        <span>秒</span>
                      </p>
                    </Col>
                  </Row>
                </>
              )
            })}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default VideoStatistic;
