/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 09:38:02
 * @LastEditTime: 2023-10-23 15:46:38
 * @Description: 问卷下载
 */
import { useState, useRef, useEffect, useMemo } from 'react';
import { Form, InputNumber, DatePicker, Button, Input, Modal, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { exportSurverData, getSurveyListData } from '@/api/question-download';
import dayjs from 'dayjs';
import UserTemplate from './template';
import { ColumnsType } from 'antd/es/table';
import { useGetScrollCount } from '@/hooks';
import { to } from '@/utils/utils';

function QuestionDownload() {
  const [form] = Form.useForm();
  const params = useRef<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<Record<string, any>>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); //  每页显示条数

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage])

  const currentDataSource = useMemo(() => {
    return dataSource.slice(startIndex, startIndex + pageSize);
  }, [pageSize, currentPage, dataSource])

  useEffect(() => {
    getData();
  }, [])


  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'surveyId', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'surveyTitle', width: 150, },
    { title: '问题ID', dataIndex: 'questionID', width: 150, },
    { title: '问题标题', dataIndex: 'questionTitle', width: 170, },
    { title: '测试人ID', dataIndex: 'userId', width: 150 },
    { title: '回答时间', dataIndex: 'answerTime', width: 250, render: (_, record) => <>{dayjs(record?.answerTime).format('YYYY-MM-DD HH:mm:ss')}</> },
    // {
    //   title: '操作',
    //   key: 'operation',
    //   width: 180,
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <>
    //       <Button className='m-1'>新增问卷背景问题</Button>
    //       <Button className='m-1' type='primary'>编辑问卷背景问题</Button>
    //       <Button className='m-1' danger type='primary'>删除问卷背景问题</Button>
    //     </>
    //   )
    // }
  ];

  /**
   * @desc 获取数据
   */
  const getData = async () => {
    setLoading(true);
    const [, result] = await to(getSurveyListData({ ...params.current }));
    result && setDataSource(result);
    setLoading(false);
  }

  /**
   * @desc 导出数据
   */
  const exportData = async () => {

    const { createTime, surveyId, userId } = await form.validateFields();
    let params: Record<string, any> = { surveyId, userId };
    if (createTime && Array.isArray(createTime)) {
      const [start, end] = createTime;
      params.createTime = [
        dayjs(start).format("YYYY-MM-DDT00:00:00"),
        dayjs(end).format("YYYY-MM-DDT00:00:00"),
      ];
    }
    try {
      const res = await exportSurverData(params);
      const file = new Blob([res.data], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.download = surveyId
        ? `问卷-${surveyId}-调查结果.xlsx`
        : `问卷调查结果-${+Date.now()}.xlsx`;
      a.href = url;
      a.click();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @desc 选择测试人
   */
  const chooseTestUser = async () => {
    Modal.confirm({
      title: '选择测试人',
      content: <UserTemplate ref={modalRef} />,
      icon: null,
      maskClosable: false,
      closable: true,
      width: 520,
      onOk: async () => {
        const { userId } = modalRef.current!
        form.setFieldValue('userId', userId.current);
      }
    })
  }

  const scrollXCount = useGetScrollCount(columns);

  /**
   * @desc 重置搜索
   * @param {Boolean} bool 是否重置
   */
  const resetSearch = async (bool: boolean = false) => {
    if (bool) {
      form.resetFields();
    }
    params.current = form.getFieldsValue();
    getData();
  }

  return (
    <>
      <div className='mb-6'>
        <Form layout='inline' form={form}>
          <Form.Item label='时间段' name='createTime' className='!mb-4'>
            <DatePicker.RangePicker style={{ width: '250px' }} />
          </Form.Item>
          <Form.Item label='问卷ID' name='surveyId' className='!mb-4'>
            <InputNumber placeholder='请输入问卷ID' controls={false} style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item label='测试人ID' name='userId' className='!mb-4'>
            <Input
              placeholder='请选择测试人...'
              disabled
              size={'small'}
              suffix={<Button type='primary' onClick={() => chooseTestUser()}>选择测试人</Button>}
            />
          </Form.Item>
          <Form.Item className='!mb-4'>
            <Button type='primary' loading={loading} onClick={() => resetSearch()}>查询</Button>
            <Button type='default' className='ml-2' onClick={() => resetSearch(true)}>清空</Button>
          </Form.Item>
        </Form>
      </div>
      <div className='my-2 flex justify-end'>
        <Button type='primary' onClick={() => exportData()}>导出问卷</Button>
      </div>
      <Table
        columns={columns}
        bordered
        loading={loading}
        dataSource={currentDataSource}
        scroll={{ x: scrollXCount }}
        rowKey='questionID'
        pagination={{
          current: currentPage,
          pageSize,
          total: dataSource.length,
          onChange: (page: number, pageSize: number) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }
        }}
      ></Table>
    </>
  )
}

export default QuestionDownload;
