function maxSum(arr) {
    let maxSum = arr[0];
    for(let i = 0; i < arr.length; i++) {
        let curSum = 0;
        for(let j = i; j < arr.length; j++) {
            curSum += arr[j];
            if(curSum >= maxSum) {
                maxSum = curSum;
            }
        }
    }
    return maxSum;
}

function maxSum2(arr) {
    let maxSum = Number.MIN_SAFE_INTEGER;
    let curSum = 0;
    for(let i = 0; i < arr.length; i++) {
        if(curSum <= 0) {
            curSum = arr[i];
        }else {
            curSum += arr[i];
        }
        if(curSum > maxSum) {
            maxSum = curSum;
        }
    }
    return maxSum;
}


global.console.log(maxSum2([1, -2, 3, 2]))