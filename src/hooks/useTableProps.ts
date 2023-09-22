/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 09:50:53
 * @LastEditTime: 2023-09-22 17:21:06
 * @Description: 基于ahooks的分页封装
 */
const useTableProps = (value: Record<string, any>) => {
  return { ...value, pagination: { ...value.pagination, showTotal: (total: number) => `共${total}数据`, showQuickJumper: true, showSizeChanger: true, } };
}

export default useTableProps;
