
import { getUserList } from '@/api/user';
import { TNumberOrString } from '@/types/common.type';
import { useAntdTable } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import { Ref, forwardRef, useState, useImperativeHandle } from 'react';
import { Table } from 'antd';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getUserList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function UserTemplate(props = {}, ref?: Ref<unknown>) {

  const [userList, setUserList] = useState<any[]>([]);

  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    defaultType: 'advance',
  });

  useImperativeHandle(ref, () => {
    return {
      userList,
    }
  });

  const columns: ColumnsType<any> = [
    { title: '用户ID', dataIndex: 'id', fixed: 'left', width: 300, },
    { title: '用户名', dataIndex: 'username', width: 150, },
    { title: '手机号', dataIndex: 'phoneNumber', width: 150, },
    { title: '备注', dataIndex: 'remark', width: 150, },
  ];

  //  多选操作
  const rowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      setUserList(selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      setUserList(selectedRows);
    },
  }

  return (
    <div style={{ height: '600px', overflowY: 'auto' }}>
      <Table rowSelection={rowSelection} columns={columns} bordered rowKey='id' {...tableProps} />
    </div>
  )
}

export default forwardRef(UserTemplate);
