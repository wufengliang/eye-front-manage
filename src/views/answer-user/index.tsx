/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-17 17:16:24
 * @LastEditTime: 2023-10-18 11:32:32
 * @Description: 问卷答案下的所有用户
 */
import { getUserList } from '@/api/user';
import { CustomBack } from '@/components';
import { useGetScrollCount, useTableProps } from '@/hooks';
import { TNumberOrString } from '@/types/common.type';
import { useAntdTable } from 'ahooks';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useSearchParams } from 'react-router-dom';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, }, form: Record<string, string | number> = {}): Promise<any> => {
  return getUserList({ page: params.current, size: params.pageSize, ...form }).then(result => result);
}

function AnswerUser() {

  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ],
    defaultType: 'advance',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();



  const columns: ColumnsType<any> = [
    { title: '用户ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '用户名', dataIndex: 'username', width: 150, },
    { title: '用户联系电话', dataIndex: 'phoneNumber', width: 150, },
    {
      title: '操作',
      key: 'operation',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' onClick={() => navigate(`/projectDetail/${searchParams.get('id')}`)}>查看用户用户填写</Button>
        </>
      )
    }
  ];

  const scrollXCount = useGetScrollCount(columns);

  return (
    <>
      <div className='my-4'>
        <CustomBack />
      </div>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...useTableProps(tableProps)} />
    </>
  )
}

export default AnswerUser;
