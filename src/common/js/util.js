// 工具性方法

// 洗牌算法，随机打乱数组
export function shuffle(arr){
    // 复制一份，防止修改原数组
    let _arr = arr.slice();
    for(let i = 0; i < _arr.length ; i++){
        let j = getRandomInt(0,i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
}

// 截流函数(延迟执行函数)，第一个参数是一个函数，第二个参数是延迟时间
export function debounce(func ,delay){
    let timer;
    // 返回一个函数
    return  function (...args){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout( () => {
            func.apply(this,args);
        }, delay)

    }
}

// 返回(min,max] 之间的随机整数
function getRandomInt(min ,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}









