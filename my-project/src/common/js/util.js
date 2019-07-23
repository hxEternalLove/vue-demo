/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(){
  let url = window.location.href;
  let obj = {};
  // 正则表达含义：包含 ？或 & 的字符，字符后面跟着的 非 ？和 & 的字符，一个或多个 + ，中间用 = 连接，等号后面跟着 非 ？和 & 的字符，+ 一个或多个，/g 全局匹配
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item)=>{
      // 截取 字符串 index:1 到最后,再将截取后的字符串以 ‘=’ 为分隔符，分割为数组
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val
    })
  }
  return obj;
};