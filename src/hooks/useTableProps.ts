/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 09:50:53
 * @LastEditTime: 2023-09-13 10:36:46
 * @Description: 基于ahooks的分页封装
 */
const useTableProps = (value: Record<string, any>) => {
  return { ...value, pagination: { ...value.pagination, showQuickJumper: true, showSizeChanger: true, } };
}

export default useTableProps;
