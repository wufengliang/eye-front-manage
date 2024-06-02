import { routerMap } from "@/layout/params";

/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2024-05-29 23:24:21
 * @LastEditTime: 2024-05-31 10:40:32
 * @Description:
 */
export function treeData(arr:Array<Record<string,any>>){
  const map:Record<string,any> = {};
  arr.forEach(item=>{
    const {primaryMenu,id,functionName} = item;
    map[primaryMenu] = map[primaryMenu] || {};
    map[primaryMenu].title = primaryMenu;
    map[primaryMenu].path = routerMap[primaryMenu]?.path;
    map[primaryMenu].icon = routerMap[primaryMenu]?.icon;
    map[primaryMenu].key = `p-${primaryMenu}`;
    map[primaryMenu].children = map[primaryMenu].children || [];
    map[primaryMenu].children.push({title:functionName,key:id});
  })
  return Object.values(map);
}
