/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-20 11:44:16
 * @LastEditTime: 2023-10-20 11:56:16
 * @Description:
 */
import { useGetScrollCount } from "@/hooks";
import { ColumnsType } from "antd/es/table";
import { Ref, forwardRef, useImperativeHandle, useRef } from "react"
import { Table } from 'antd';
import { TNumberOrString } from "@/types/common.type";
import { getUserList } from "@/api/user";
import { useAntdTable } from "ahooks";


const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, }, form: Record<string, string | number> = {}): Promise<any> => {
  return getUserList({ page: params.current, size: params.pageSize, }).then(result => result);
}

function UserTemplate(props = {}, cref?: Ref<unknown>) {

  const selectId = useRef<any>(null);

  const { tableProps, } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, },
    ],
  });

  //  多选操作
  const rowSelection: Record<string, any> = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      selectId.current = record?.id;
    },
    type: 'radio'
  }

  useImperativeHandle(cref, () => {
    return {
      userId: selectId
    }
  }, []);

  const columns: ColumnsType<any> = [
    { title: '用户ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '用户名', dataIndex: 'username', width: 150, },
    { title: '手机号', dataIndex: 'phoneNumber', width: 150, }
  ];

  const scrollXCount = useGetScrollCount(columns);

  return (
    <>
      <Table rowSelection={rowSelection} columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...tableProps} />
    </>
  )
}

export default forwardRef(UserTemplate);
