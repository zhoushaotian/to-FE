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
    let mid = arr.splice(midIndex, 1)[0]; //基准元素不参与此次排序，只用作比较 ?为什么要跳过基准元素
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