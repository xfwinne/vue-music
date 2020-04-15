// 封装公共的jsonp方法
// 先引入原始的jsonp
import originJsonp from 'jsonp'
export default function jsonp(url,data,option){
    // url为地址
    // data为地址后的参数
    // option为原始jsonp库对应的选项参数
    url += (url.indexOf('?')<0 ? '?' : '&') + param(data);
    return new Promise((resolve,reject) => {
        // 原始的jsonp中的url是参数要拼接好了的
        originJsonp(url,option,(err,data) => {
            if(!err){
                // 如果异步成功调用resolve这个函数
                // console.log(data)
                // console.log(url)
                resolve(data);
            }else{
                // 出错了会直接调用reject这个函数
                // console.log(err)
                reject(err);
            }
        })

    });

}

// 定义一个url和参数结合一体的函数（url参数拼接）
function param(data){
    let url = '';
    for(var k in data){
        let value = data[k] !== undefined ? data[k]: '';
        // 防止参数为中文时出现乱码，把字符串作为 URI 组件进行编码
        url += `&${k}=${encodeURIComponent(value)}`;
    }

    return url ? url.substring(1) : '';
}












