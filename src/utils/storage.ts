/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-01 15:23:33
 * @LastEditTime: 2023-09-04 15:24:00
 * @Description:
 */
export class Storage {
  static getItem(key: string) {
    const value = window.localStorage.getItem(key);
    if (value === 'null' || value === 'undefined') {
      return;
    }
    return JSON.parse(value!);
  }


  static setItem(key: string, value: unknown) {
    const val = JSON.stringify(value);
    if (typeof value === 'boolean') {
      return window.localStorage.setItem(key, val);
    }

    if (!!value) {
      return window.localStorage.setItem(key, val);
    }
  }

  static removeItem(key: string) {
    return window.localStorage.removeItem(key);
  }

  static removeAll() {
    return window.localStorage.clear();
  }
}
