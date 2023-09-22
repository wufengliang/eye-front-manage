/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 17:16:06
 * @LastEditTime: 2023-09-22 10:00:31
 * @Description: 自定义搜索配置项
 */

import React from "react";

export type ComponentType = 'Input' | 'InputNumber' | 'Select' | 'DatePicker'

export interface ICustomSearchItem {
  type: ComponentType;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: unknown;
  showClear?: boolean;
  dataSource?: Array<unknown>;
  renderSingle?: (...args: any) => React.ReactNode;
  min?: number;
  max?: number;
  style?: Record<string, string | number>;
}

export interface ICustomSearchType {
  columns: Array<ICustomSearchItem>,  //  定义搜索项集合
  showSearch?: boolean; //  定义是否展示搜索按钮
  showReset?: boolean;  //  定义是否展示重置按钮
  singleSpan?: number; //  响应式布局
  disabled?: boolean;
  loading?: boolean;
  onSearch?: (...args: any) => void;
  onReset?: (...args: any) => void;
}
