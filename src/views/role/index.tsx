/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-29 22:57:52
 * @LastEditTime: 2024-05-30 00:45:11
 * @Description: 角色管理
 */
import { useState, useEffect, useRef } from 'react';
import { getListRole, getAllPermissionRoleList, saveOrUpdateRole, deleteRole } from '@/api/role';
import { Button, Card, Empty, Modal, message } from 'antd';
import { to } from '@/utils/utils';
import { treeData } from './params';
import TreeTemplate from './tree';
import Template from './template';
import { OperateType } from '@/types/operate.enum';

function PermissionBox() {
  const [permissionList, setPermissionList] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const templateRef = useRef<any>();

  useEffect(() => {
    getData();
    getAllPermission();
  }, [])

  /**
   * 获取角色列表数据
   */
  const getData = async () => {
    const [, result] = await to(getListRole());
    if (result) {
      console.log(result);
      setRoleList(result);
    }
  }

  /**
   * 获取所有权限
   */
  const getAllPermission = async () => {
    const [, result] = await to(getAllPermissionRoleList());
    if (result) {
      setPermissionList(treeData(result));
    }
  }

  /**
   * 角色操作
   */
  const handleOperate = async (type: OperateType, data?: Record<string, any>) => {
    switch (type) {
      case OperateType.ADD:
      case OperateType.EDIT:
        const isAddMode = type === OperateType.ADD;
        let treeValue = (data ? treeData(data.permissionList) : []).map(i => {
          return [].concat(i.key, i.children.map((d: any) => d.key))
        }).flat();
        console.log(treeValue);
        return Modal.confirm({
          title: `${isAddMode ? '创建' : '编辑'}角色`,
          icon: null,
          closable: true,
          width: 520,
          content: <Template {...data} treeValue={treeValue} treeData={permissionList} ref={templateRef} />,
          maskClosable: false,
          onOk: async () => {
            const { id } = data || {};
            const [, result] = await to(templateRef?.current?.validate());
            if (!result) {
              return Promise.reject("错误");
            }
            const [error] = await to(saveOrUpdateRole({ ...result, id }));
            if (!error) {
              message.success(`${isAddMode ? '创建' : '更新'}成功`);
              getData();
            } else {
              return Promise.reject("错误");
            }
          }
        });
      case OperateType.DELETE:
        return Modal.confirm({
          title: `确认删除${data?.roleName}吗？`,
          maskClosable: false,
          onOk: async () => {
            const [error] = await to(deleteRole(data?.id));
            if (!error) {
              message.success('删除成功');
              getData();
            }
          }
        });
    }
  }

  return (
    <>
      <div className='my-4 ml-2'>
        <Button type='primary' onClick={() => handleOperate(OperateType.ADD)}>创建角色</Button>
        <div className='mt-2'>
          {roleList.map(i => {
            const nowPermissionList = treeData(i.permissionList);
            return (
              <Card
                className='mb-4'
                key={i.id}
                title={i.roleName}
                extra={
                  <>
                    <Button type='primary' onClick={() => handleOperate(OperateType.EDIT, i)}>编辑</Button>
                    <Button danger type='primary' className='ml-2' onClick={() => handleOperate(OperateType.DELETE, i)}>删除</Button>
                  </>
                }
              >
                {nowPermissionList.length ? <TreeTemplate treeData={nowPermissionList} /> : <Empty />}
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default PermissionBox;
