/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 09:42:16
 * @LastEditTime: 2023-09-13 10:46:02
 * @Description: react版本computed功能
 */
import { useEffect, useState } from 'react';

const useComputed = (getter: Function, dependencies = []) => {
  const [value, setValue] = useState(() => getter());

  useEffect(() => {
    setValue(getter());
  }, dependencies);

  return value;
}

export default useComputed;
