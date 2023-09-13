/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 11:18:15
 * @LastEditTime: 2023-09-13 11:31:15
 * @Description: 计算table滚动总长度
 */
import type { ColumnsType } from 'antd/es/table';
import { IColumnType } from '@/types/common.type';

const useGetScrollCount = (columns: ColumnsType<IColumnType>): number => {
  return columns.reduce((prev, next) => prev + (next.width ? parseInt(`${next.width}`) : 120), 0);
}

export default useGetScrollCount;
