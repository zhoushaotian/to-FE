//排序算法
/**
 * 快速排序
 * 
 * @param {Array} arr 待排序数组
 * @return {Array} 已排序的数组
 */
function quickSort(arr){
    if(arr.length <= 1){//递归的基准，如果数组长度为1则直接返回这个数组
        return arr;
    }
    let left = [];
    let right = [];
    //选择本次排序的基准元素
    let midIndex = Math.floor(arr.length/2);
    let mid = arr.splice(midIndex, 1)[0]; //基准元素不参与此次排序，只用作比较，这里必须跳过基准元素，不然得到的数组很有可能会产生死递归
                                          //考虑[1,2]基准元素为1.
    //开始计算左右数组
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] <= mid) {
            left.push(arr[i]);
        }else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([mid], quickSort(right)); //不断递归，连接左右两个数组
}
let quickSortArray = [2,4,5,6,733,23,123,432,532,5,7,1];
console.log('待排序数组:', quickSortArray);
console.log('开始快速排序');
console.log('排序结果:', quickSort(quickSortArray));



/**
 * 判断一个变量的类型
 * 
 * @param {String} type 需要判断的类型 
 * @returns 判断某个类型的函数
 */
function isType(type) {
    return function(obj) {
        if(toString.call(obj) === `[object ${type}]`) return true
        return false;
    };
}
/**
 * 递归判断两个对象是否相等
 * 
 * @param {Obejct} target 
 * @param {Object} source 
 * @returns Boolean
 */
function isObjectEqual(target, source) {
    for (var key in target) {
        if(typeof target[key] === 'object' && typeof source[key] === 'object') {
            if(toString.call(target[key]) !== toString.call(source[key])) {
                return false;
            }
            if(!isObjectEqual(target[key], source[key])) {
                return false;
            }
        }else {
            if(target[key] !== source[key]){
                return false;
            }
        }
    }
    return true;
}
let target = {
    1: {1:3,2:1},
    2: 3
};
let source = {
    1: {1:3,2:1},
    2: 3
};
console.log(`验证是否相等`);
console.log(isObjectEqual(target, source));

/**
 * 堆排序
 * 
 * @param {Array} arr 待排序数组 
 */
function heapSort(arr) {
    function swap(arr, src, tar){
        let temp = arr[src];
        arr[src] = arr[tar];
        arr[tar] = temp;
    }
    function heap(arr, index, size) {
        let max,left,right;
        while(true) {
            max = index;
            left = 2*max + 1;
            right = 2*(max + 1);
            if(left < size && arr[index] < arr[left]) {
                max = left;
            }
            if(right < size && arr[max] < arr[right]) {
                max = right;
            }
            if(max !== index){
                swap(arr, max, index);
                index = max;
            }else{
                break;
            }
        }
    }
    function buildHeap(arr) {
        let parent = Math.floor(arr.length / 2) - 1;
        for(let i = parent; i>=0; i--) {
            heap(arr, i, arr.length);
        }
    }
    // 开始排序
    // 先将数组初始化为最大堆
    buildHeap(arr);
    console.log('创建堆', arr.toString());
    // 交换堆顶和最后一个元素的位置 再调整堆
    for(let i = arr.length-1; i>0; i--) {
        swap(arr, 0, i);
        heap(arr, 0, i);
    }
    console.log(arr.toString());
}
let arr = [2,4,25,64,32,12,1,4,5];
console.log('堆排序',arr.toString());
heapSort(arr);