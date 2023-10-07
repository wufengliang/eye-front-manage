/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-09 11:27:55
 * @LastEditTime: 2023-09-23 10:10:22
 * @Description: 项目管理
 */
import { Table, Button, Tag, Row, Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import { OperateType } from '@/types/operate.enum';
import { TNumberOrString } from '@/types/common.type';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { getProjectList, createProjectData, updateProjectData } from '@/api/project';
import { CustomSearch } from '@/components';
import { DeleteOutlined } from '@ant-design/icons';
import ProjectTemplate from './template';
import RecoveryTemplate from './recovery';
import FaceTemplate from './face';
import { to } from '@/utils/utils';
import dayjs from 'dayjs';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getProjectList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function ProjectManage() {
  const searchRef = useRef<unknown>(null);
  const createProjectRef = useRef(null);
  const [selectedArray, setSelectedArray] = useState<unknown[]>([]);

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' },
    ],
    form: (searchRef.current as Record<string, any>)?.form
  });

  const columns: ColumnsType<any> = [
    { title: '问卷ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '问卷标题', dataIndex: 'title', width: 150, },
    { title: '问卷开始语简介', dataIndex: 'startTips', width: 150, },
    { title: '问卷结束语简介', dataIndex: 'endTips', width: 170, },
    {
      title: '投放开始时间',
      dataIndex: 'startTime',
      width: 180,
      render: (_, record) => (
        <>{dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '投放结束时间',
      dataIndex: 'endTime',
      width: 180,
      render: (_, record) => (
        <>{dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</>
      )
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          {record.status !== 0 ? <Button className='margin-bottom-10' type='primary'>重新编辑</Button> : null}
          <Button type='primary' className='margin-bottom-10' onClick={() => handleOperate(OperateType.DETAIL, record)}>查看详情</Button>
          <Button type='primary' danger onClick={() => handleOperate(OperateType.DELETE, record)}>删除</Button>
        </>
      )
    }
  ];

  //  多选操作
  const rowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      setSelectedArray(selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      setSelectedArray(selectedRows);
    },
  }

  const handleOperate = async (type: OperateType, data?: unknown) => {
    switch (type) {
      case OperateType.ADD:
        return createProject();
      case OperateType.RECOVERY:
        return showRecovery();
      case OperateType.DELETE:
        return deleteProject(data);
      case OperateType.FACESHOW:
        return showFaceManage();
      default:
        return;
    }
  }

  /**
   * @desc 展示人脸示范管理
   */
  const showFaceManage = async () => {
    Modal.confirm({
      title: "人脸识别示范管理",
      content: <FaceTemplate />,
      width: 600,
      maskClosable: false,
      closable: true,
      icon: null,
      footer: null,
    })
  }

  /**
   * @desc 删除项目
   */
  const deleteProject = (data: unknown) => {
    Modal.confirm({
      title: '提示',
      content: `确认删除该项目吗?`,
      maskClosable: false,
      closable: true,
      onOk: async () => {
        const { id, } = data as Record<string, any>;
        const [error] = await to(updateProjectData(id, 2));

        if (!!!error) {
          message.success(`删除成功`);
          search.submit();
        }
      }
    })
  }

  /**
   * @desc 回收站
   */
  const showRecovery = async () => {
    Modal.confirm({
      title: '回收站',
      width: 800,
      content: <RecoveryTemplate />,
      footer: null,
      maskClosable: false,
      icon: null,
      closable: true,
    })
  }

  /**
   * @desc 创建项目
   */
  const createProject = async () => {
    Modal.confirm({
      title: '创建项目',
      icon: null,
      width: 600,
      closable: true,
      maskClosable: false,
      content: <ProjectTemplate ref={createProjectRef} />,
      onOk: async () => {
        const { validate } = createProjectRef.current as unknown as Record<string, Function>;
        const [error, result] = await to(validate());

        if (error) {
          return Promise.reject(error);
        }
        const params = {
          ...result,
          startTime: dayjs(result.startTime).format('YYYY-MM-DD[T]HH:mm:ss'),
          endTime: dayjs(result.startTime).format('YYYY-MM-DD[T]HH:mm:ss')
        }
        const [err, value] = await to(createProjectData(params));
        updateProjectData(value.surveyId);
        if (!err) {
          message.success('创建成功');
          return search.reset();
        }

      }
    })
  }

  const scrollXCount = useGetScrollCount(columns);


  //  搜索区域
  const renderSearch = () => {
    return (
      <div className='mb-6'>
        <CustomSearch
          ref={searchRef}
          loading={tableProps.loading}
          onSearch={() => search.submit()}
          onReset={() => search.reset()}
          columns={[{ name: 'search', label: '问卷标题', type: 'Input', defaultValue: null, placeholder: '请输入...' }]}
        />
      </div>
    )
  }

  //  额外操作区域
  const renderOperate = () => {
    return (
      <Row justify={'end'}>
        <Button className='mb-3 mr-2' icon={<DeleteOutlined />} onClick={() => handleOperate(OperateType.RECOVERY)}>回收站</Button>
        <Button className='mb-3 mr-2' type='primary' onClick={() => handleOperate(OperateType.FACESHOW)}>人脸识别示范管理</Button>
        <Button disabled={selectedArray.length === 0} className='mb-3 mr-2' type='primary' onClick={() => handleOperate(OperateType.COPY)}>复制问卷</Button>
        <Button className='mb-3 mr-2' type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加项目</Button>
      </Row>
    )
  }


  return (
    <div className='project-box'>
      {renderSearch()}
      {renderOperate()}
      <Table columns={columns} rowSelection={rowSelection} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </div>
  )
}

export default ProjectManage;
