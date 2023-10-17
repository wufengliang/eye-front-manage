/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-08-30 10:51:39
 * @LastEditTime: 2023-10-16 11:53:42
 * @Description:
 */
import Cookies from 'js-cookie';
import { USER_TOKEN } from '@/utils/variable';
import { IMoveType } from '@/types/common.type';
import G2 from '@antv/g2';

/**
 * @returns 返回当前token信息
 */
export const checkHasLogin = () => {
  return Cookies.get(USER_TOKEN);
}

/**
 * @desc 去登录
 */
export const login = () => {
  const { origin } = window.location;
  Cookies.remove(USER_TOKEN);
  window.location.href = `${origin}/login`;
}

/**
 * @desc to-js
 */
export async function to(p: Promise<any>): Promise<Array<any>> {
  try {
    const value = await p;
    return [null, value];
  } catch (err) {
    return [err, null];
  }
}

/**
 * @desc 获取文件后缀名
 */
export function getExt(value: string) {
  const array = value.match(/\.([^.]+)$/);
  console.log(array);
  return array ? array[1] : null;
}

/**
 * @desc 生成轨迹图
 * @param {IMoveType} options 配置
 */
export function createMoveMap(options: IMoveType) {
  const { container, width, height, url, data } = options;
  const div = document.createElement('div');
  div.style.transform = `scale(0.5)`;
  div.style.transformOrigin = '0 0';
  div.style.width = `${width * 0.5}px`;
  div.style.height = `${height * 0.5}px`;
  container.appendChild(div);
  const chart = new G2.Chart({
    container: div,
    width,
    height,
  });
  chart.axis(false);
  chart.tooltip(false);
  chart.source(data);
  chart
    .path()
    .size(4)
    .position('x*y');
  chart
    .point()
    .position('x*y')
    .label('x', {
      formatter: (a: any, b: any, index: number) => {
        return index + 1;
      },
      textStyle: {
        textAlign: 'center', // 文本对齐方向，可取值为： start middle end
        fill: '#f00', // 文本的颜色
        fontSize: '28', // 文本大小
        fontWeight: 'bold', // 文本粗细
        textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
      }
    })
    .size('r', (value: number) => {
      return value / 2;
    })
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 4
    });
  chart.guide().image({
    start: ['min', 'max'],
    end: ['max', 'min'],
    // eslint-disable-next-line no-restricted-globals
    src: url.replace(/(http|https):/, location.protocol),
  })
  chart.render();
  return chart;
}
