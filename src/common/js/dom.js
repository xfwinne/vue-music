// 公共操作dom的函数
export function addClass(el,className){
    if(hasClassName(el,className)){
        return false;
    }
    // 取到元素身上的所有class，用空格切割成数组
    let newClass = el.className.split(' ');
    // 把要添加的类名添加进去
    newClass.push(className);
    // 然后再用空格连成字符串
    el.className = newClass.join(' ');
}

export function hasClassName(el,className){
    // 正则表达式匹配是否存在这个类名，以类名开头，或者空白字符开头；以空白字符结尾，或者直接结束(因为是字符串，所以要转义一下)
    let reg = new RegExp("(^|\\s+)"+
        className+"(\\s+|$)");
    return reg.test(el.className);

}

// 获取元素的属性或者设置元素属性
export function toggleAttrData(el,name,val){
    let prefix = "data-";
    name = prefix + name;
    if(val){
        // 如果有传入值就设置属性的值
        return el.setAttribute(name,val);
    }else{
        // 没有传入值就获取属性的值
        return el.getAttribute(name);

    }
}

// js前缀添加

let elementStyle = document.createElement("div").style;

let vendor = ( () => {
    let transformNames = {
        webkit : "webkitTransform",
        moz : "mozTransform",
        o : "oTransform",
        ms : "msTransform",
        standard : "transform",
    }
    // 判断浏览器支持哪个前缀，然后相应添加
    for(let key in transformNames){
        if(elementStyle[transformNames[key]] !== undefined){
            return key;
        }
    }
    return false;

})();


export function prefixStyle(style){
    if(vendor === false){
        return false;
    }
    if(vendor === "standard"){
        return style;
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}




