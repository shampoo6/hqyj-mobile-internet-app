function $(id) {
	return document.getElementById(id);
}

function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj)[attr];
	}
}
//		二,将前进后退封装为通用函数
//		1,运动对象  obj
//		2,运动方向  direct
//		3,目标点     target
//		4,纵向或横向    attr
//		5,回调函数  endFn
function Go(obj, direct, target, attr, endFn) {
	clearInterval(obj.timer); //解决连续点击后元素变快的问题
	obj.timer = setInterval(function() {
		var pos = parseInt(getStyle(obj, attr)) + direct;
		if(pos >= target && direct > 0 || pos <= target && direct < 0) {
			pos = target; //让元素停在指定位置
		}
		obj.style[attr] = pos + 'px';
		if(pos == target) {
			clearInterval(obj.timer); //元素到目标点之后，关闭定时器
			if(endFn) {
				endFn();
			}
		}
	}, 20)
}

//淡入淡出函数
//1,对象  obj
//2,变化方式（淡入/淡出）   way 为正淡入  为负淡
function fadeToggle(obj, way, endFn) {
	var n;
	way > 0 ? n = 0 : n = 1;
	var fade = setInterval(function() {
		n = n + way;
		obj.style.opacity = n;
		if(n >= 1 && way > 0 || n <= 0 && way < 0) {
			clearInterval(fade);
			if(endFn) {
				endFn();
			}
		}
	}, 40)
}

function DoubleFn(n) {
	n < 10 ? n = '0' + n : n;
	return n;
}

//shake函数需要动态传入的参数:
//	晃动对象  obj 
//	晃动方向  attr
//	是否晃动  bool 
//	晃动频率  times
//	回调函数  endFn
function shake(obj, attr, bool, times, endFn) {
	var pos = parseInt(getStyle(obj,attr));
	var arr = [];
	for(var i = times; i >= 0; i -= 4) {
		arr.push(-i, i);
	}
	arr.push(0);
	var num = 0;
	if(bool) {
		obj.shaker = setInterval(function() {
			obj.style[attr] = pos + arr[num] + 'px';
			num++;
			if(num == arr.length) {
				clearInterval(obj.shaker);
				bool = true;
				if(endFn){
					endFn()
				}
			}
		}, 50)
	}
	bool = false;
}

function getFirst(obj) {
	//	if(obj.firstElementChild){
	//		return obj.firstElementChild;
	//	}else{
	//		return obj.firstChild;
	//	}
	return obj.firstElementChild || obj.firstChild;
	//	var ele;
	//	obj.firstElementChild ? ele=obj.firstElementChild : ele=obj.firstChild;
	//	return ele;
}

//获取元素位置
function getPos(obj) {
	var pos = {
		'top': 0,
		'left': 0
	};
	while(obj) {
		pos.top += obj.offsetTop;
		pos.left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return pos;
}

function bind(obj, evName, fn) {
	if(obj.addEventListener) {
		obj.addEventListener(evName, fn, false);
	} else {
		obj.attachEvent('on' + evName, function() {
			fn.call(obj);
		})
	}
}
//function dispear(obj,step,endFn){
//	var n=1;
//	if(step>0){n=0;}
//	obj.op = setInterval(function(){
//		n=n+step;
//		obj.style.opacity=n;
//		if(n<=0 || n>=1){
//			clearInterval(obj.op);
//			if(endFn){
//				endFn();
//			}
//		}
//	},40)
//}
//dispear(oBox,-0.06);
//dispear(oBox,0.06);

//function show(obj,endFn){
//	var n=0;
//	obj.opS = setInterval(function(){
//		n=n+0.06;
//		obj.style.opacity=n;
//		if(n>=1){
//			clearInterval(obj.opS);
//			if(endFn){
//				endFn();
//			}
//		}
////		console.log(n);
//	},40)
//}
//getStyle(oBox,'width');
//function getStyle(obj,attr){
//	if(oBox.currentStyle){
//		return oBox.currentStyle.width;
//	}else{
//		return getComputedStyle(oBox).width;
//	}
//}
//jqurey