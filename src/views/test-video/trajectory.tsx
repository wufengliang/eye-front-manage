/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-28 18:21:55
 * @LastEditTime: 2023-10-28 18:32:29
 * @Description:
 */
import { useRef, useEffect } from 'react';

function TrajectoryTemplate(props: Record<string, any> = {}) {
  const { container } = props;
  const boxRef = useRef<any>(null);

  useEffect(() => {
    if (boxRef.current) {
      (boxRef.current as HTMLElement).appendChild(container);
    }
  }, [boxRef])

  return (
    <div ref={(e) => (boxRef.current = e)}>

    </div>
  )
}

export default TrajectoryTemplate;
