/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-05 16:50:43
 * @LastEditTime: 2023-09-21 16:40:34
 * @Description: 用户管理
 */
import { useRef } from 'react';
import { Table, Button, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table'
import { useAntdTable } from 'ahooks';
import { TNumberOrString } from '@/types/common.type';
import { getUserList, deleteUser, createUser, updateUser } from '@/api/user';
import dayjs from 'dayjs';
import { to } from '@/utils/utils';
import UserTemplate from './template';
import { OperateType } from '@/types/operate.enum';
import { useGetScrollCount } from '@/hooks';
import { pick } from 'lodash-es';
import './index.scss';
import { useSelector } from 'react-redux';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getUserList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function UserManage() {

  const { tableProps, search } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    defaultType: 'advance',
  });

  const user = useSelector((state: Record<string, any>) => state.user);

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
              search.submit();
            }
          }
        });
      default:
        return Modal.confirm({
          title: `${type === OperateType.EDIT ? '编辑' : '创建'}用户`,
          icon: null,
          closable: true,
          width: 500,
          content: <UserTemplate key='userTemplate' ref={modalRef} {...(data || {})} />,
          onOk: () => {
            const role = user.userInfo.role === 2 ? 1 : 0;  //  默认只有管理员、超管才可以创建用户
            const { validate } = modalRef.current!;
            if (validate && typeof validate === 'function') {
              (validate as Function)().then(async (value: Record<string, any>) => {
                const [error] = await to(type === OperateType.EDIT ? updateUser({ ...pick(value, ['role', 'status', 'remark']), ...pick(data, ['id', 'status']) }) : createUser(role, value))
                if (!error) {
                  search.submit();
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
      render: (_, record) => <a href='javascript'>{dayjs(record.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}</a>
    },
    { title: '备注', dataIndex: 'remark', width: 150, },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-bottom-10' onClick={() => handleOperate(OperateType.EDIT, record)}>编辑</Button>
          <Button type='primary' danger onClick={() => handleOperate(OperateType.DELETE, record)}>删除</Button>
        </>
      )
    }
  ];

  const scrollXCount = useGetScrollCount(columns);

  return (
    <div className='user-box'>
      <div className='flex justify-end mb-3'>
        <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加用户</Button>
      </div>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...tableProps} />
    </div>
  )
}

export default UserManage;
