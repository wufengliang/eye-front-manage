/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-29 23:39:44
 * @LastEditTime: 2024-05-30 00:43:46
 * @Description:
 */
import { Tree, TreeProps } from 'antd';
import { Ref, forwardRef, useImperativeHandle, useState } from 'react';

interface IProps {
  treeData: any[];
  checkable?: boolean;
  value?: any[],
  onChange?: (...args: any[]) => void
}

function TreeTemplate(props: IProps, ref?: Ref<unknown>) {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(props.value || []);

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    // console.log('onCheck', checkedKeysValue);
    const v = checkedKeysValue as React.Key[];
    setSelectedKeys(v);
    props.onChange?.(v);
  };


  return (
    <Tree
      checkable={props.checkable}
      onCheck={onCheck}
      checkedKeys={selectedKeys}
      treeData={props.treeData}
    />
  )
}

export const ForwardTree = forwardRef(TreeTemplate);

export default TreeTemplate
