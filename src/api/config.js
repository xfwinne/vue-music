// url需要传的公共参数配置文件

export const commonParams = {
    g_tk :1482260458,
    inCharset :'utf-8',
    outCharset : 'utf-8',
    notice:0,
    format :"json"
};

// jsonp原始库中要传入的参数，就是callback（如果不是jsonp而是ajax，那么将不需要管这个，直接随便写就好了）
export const options = {
    param :'jsonpCallback'
};

// 配置公共错误常量
export const ERR_OK = 0;







