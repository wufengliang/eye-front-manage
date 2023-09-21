/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-19 16:19:28
 * @LastEditTime: 2023-09-19 16:20:03
 * @Description: 下载类
 */
/**
 * @desc 下载图片
 * @param {String} url 图片地址
 * @param {String} filename  保存文件名
 */
export function downloadFile(url: string, filename: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        link.click();

        // 释放 URL 对象
        window.URL.revokeObjectURL(link.href);
        resolve(true);
      }
      xhr.onerror = (ev) => {
        reject(ev);
      }
    };
    xhr.send();
  })
}
