/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-05 16:50:43
 * @LastEditTime: 2024-06-03 17:12:25
 * @Description: 用户管理
 */
import { useMemo, useRef, useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAntdTable } from 'ahooks';
import { TNumberOrString } from '@/types/common.type';
import { getUserList, deleteUser, createUser, updateUser } from '@/api/user';
import dayjs from 'dayjs';
import { to } from '@/utils/utils';
import UserTemplate from './template';
import { OperateType } from '@/types/operate.enum';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { omit, pick } from 'lodash-es';
import { useSelector } from 'react-redux';
import CustomShowContainer from '@/components/custom-show-container';
import './index.scss';


function UserManage() {
  const { userInfo } = useSelector((state: Record<string, any>) => state.user);
  const { roleListMap } = useSelector((state: Record<string, any>) => state.role);

  const [dataSource, setDataSource] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [paginationConfig, setPaginationConfig] = useState({ page: 1, size: 10, all: userInfo.role === 1 ? 1 : null });

  // useEffect(() => {
  //   if (userInfo.role) {
  //     const v = { ...paginationConfig, all: userInfo.role === 1 ? 1 : null }
  //     setPaginationConfig(v);
  //     getData(v);
  //   }
  // }, [userInfo.role])

  useEffect(() => {
    if (userInfo.role) {
      const options = { ...paginationConfig, all: userInfo.role === 1 ? 1 : null }
      getData(options);
    }
  }, [paginationConfig, userInfo])

  //  获取数据
  const getData = async (pageOptions: { page: number, size: number, all?: any } = { page: 1, size: 10, all: userInfo.role === 1 ? 1 : null }) => {
    setLoading(true);
    const [, result] = await to(getUserList(Object.assign({}, pageOptions)));
    result && setDataSource(Object.assign(result, { current: pageOptions.page, pageSize: pageOptions.size }));
    setLoading(false);
  }

  const modalRef = useRef();

  const handleOperate = async (type: OperateType, data?: Record<string, any>) => {
    switch (type) {
      case OperateType.DELETE:
        return Modal.confirm({
          title: '提示',
          content: '确认删除该用户?',
          maskClosable: false,
          onOk: async () => {
            const [error] = await to(deleteUser(data?.id!));
            if (!error) {
              message.success('删除成功');
              getData(paginationConfig);
            }
          }
        });
      case OperateType.STATUS:
        const { status, phoneNumber } = data || {};
        return Modal.confirm({
          title: '提示',
          content: `是否${status ? '停用' : '启用'}${phoneNumber}的用户?`,
          maskClosable: false,
          onOk: async () => {
            const params = {
              ...pick(data || {}, ['id']),
              status: status ? 0 : 1
            }
            const [error] = await to(updateUser(params));
            if (!error) {
              message.success(`账号${phoneNumber}${status ? '停用' : '启用'}成功`);
              getData(paginationConfig);
            }
          }
        })
      default:
        return Modal.confirm({
          title: `${type === OperateType.EDIT ? '编辑' : '创建'}用户`,
          icon: null,
          closable: true,
          width: 500,
          content: <UserTemplate key='userTemplate' ref={modalRef} {...(data || {})} role={data?.role ?? userInfo.role} roleListMap={roleListMap} />,
          onOk: () => {
            const role = userInfo.role === 2 ? 1 : 0;  //  默认只有管理员、超管才可以创建用户
            const { validate } = modalRef.current!;
            if (validate && typeof validate === 'function') {
              (validate as Function)().then(async (value: Record<string, any>) => {
                const params = type === OperateType.EDIT ? { ...pick(value, ['role', 'status', 'remark', 'password']), ...pick(data, ['id', 'status']) } : value;

                if (type === OperateType.EDIT && params.password === '******') {
                  delete params.password;
                }

                const [error] = await to(type === OperateType.EDIT ? updateUser(params) : createUser(role, params))
                if (!error) {
                  getData(paginationConfig);
                  message.success(`${type === OperateType.EDIT ? '编辑' : '创建'}成功`);
                }
                return;
              })
            }
          }
        })
    }
  }

  const columns: ColumnsType<any> = [
    { title: '用户ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '用户名', dataIndex: 'username', width: 150, },
    { title: '手机号', dataIndex: 'phoneNumber', width: 150, },
    {
      title: '最近登录',
      dataIndex: 'lastLoginTime',
      width: 170,
      render: (_: any, record: any) => <>{dayjs(record.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}</>
    },
    { title: '备注', dataIndex: 'remark', width: 150, },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_: any, record: any) => (
        <>
          <CustomShowContainer id={3}>
            <Button className='margin-bottom-10' onClick={() => handleOperate(OperateType.EDIT, record)}>编辑</Button>
          </CustomShowContainer>
          <Button type='primary' className='margin-bottom-10' danger={record.status} onClick={() => handleOperate(OperateType.STATUS, record)}>{record.status ? '停用' : '启用'}</Button>
          <CustomShowContainer id={4}>
            <Button type='primary' danger onClick={() => handleOperate(OperateType.DELETE, record)}>删除</Button>
          </CustomShowContainer>
        </>
      )
    }
  ];

  const scrollXCount = useGetScrollCount(columns);

  return (
    <div className='user-box'>
      <div className='flex justify-end mb-3'>
        {/* {[1].includes(userInfo.role) ? <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加用户</Button> : null} */}
        <CustomShowContainer id={2}>
          <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加用户</Button>
        </CustomShowContainer>
      </div>
      <Table
        columns={columns}
        scroll={{ x: scrollXCount }}
        bordered
        rowKey='id'
        loading={loading}
        dataSource={dataSource?.list}
        pagination={dataSource}
        onChange={(pagination) => {
          const { pageSize, current } = pagination;
          setPaginationConfig({ ...paginationConfig, page: current!, size: pageSize! });
        }}
      />
    </div>
  )
}

export default UserManage;
