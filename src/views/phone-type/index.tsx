/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 16:04:41
 * @LastEditTime: 2023-09-20 17:37:16
 * @Description: 手机型号
 */
import { useRef } from 'react';
import { Button, Table, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import type { ColumnsType } from 'antd/es/table'
import { getPhoneTypeList } from '@/api/phone-type';
import { TNumberOrString } from '@/types/common.type';
import { useGetScrollCount } from '@/hooks';
import { OperateType } from '@/types/operate.enum';
import PhoneTypeTemplate from './template';

const getData = (params: { current: TNumberOrString, pageSize: TNumberOrString, all: number }, form: Record<string, string | number> = {}): Promise<any> => {
  return getPhoneTypeList({ page: params.current, size: params.pageSize, all: params.all, ...form }).then(result => result);
}

function PhoneType() {
  const { tableProps } = useAntdTable(getData, {
    defaultParams: [
      { current: 1, pageSize: 10, all: 1 },
      { search: '' }
    ]
  });

  const modalRef = useRef();

  const columns: ColumnsType<any> = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 150, },
    { title: '手机型号', dataIndex: 'phoneModel', width: 150, },
    { title: '手机别名', dataIndex: 'phoneAlias', width: 150, },
    { title: '屏幕横像素', dataIndex: 'xlength', width: 150, },
    { title: '屏幕竖像素', dataIndex: 'ylength', width: 150, },
    { title: '摄像头距离左侧像素', dataIndex: 'leftLength', width: 180, },
    { title: '摄像头距离右侧像素', dataIndex: 'rightLength', width: 180, },
    { title: '摄像头距离上侧像素', dataIndex: 'upperLength', width: 180, },
    { title: '摄像头距离下侧像素', dataIndex: 'lowerLength', width: 180, },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='primary' className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>修改</Button>
          <Button type='primary' danger className='margin-right-10 margin-bottom-5' onClick={() => handleOperate(OperateType.EDIT, record)}>删除</Button>
        </>
      )
    }
  ];

  const handleOperate = (type: OperateType, data?: Record<string, any>) => {
    Modal.confirm({
      title: type === OperateType.ADD ? '添加手机型号' : '编辑手机型号',
      content: <PhoneTypeTemplate ref={modalRef} {...(data || {})} />,
      icon: null,
      width: 600,
      maskClosable: false,
      closable: true,
      onOk: async () => {
        const { validate } = modalRef.current!;
        if (validate && typeof validate === 'function') {
          (validate as Function)().then((value: Record<string, any>) => {
            console.log(value);
          })
        }
      }
    })
  }

  const scrollXCount = useGetScrollCount(columns);

  return (
    <div className='test-video-box'>
      <div className='flex justify-end mb-3'>
        <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>添加手机型号</Button>
      </div>
      <Table columns={columns} scroll={{ x: scrollXCount }} bordered rowKey='id' {...tableProps} />
    </div>
  )
}

export default PhoneType;
