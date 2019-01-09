// promise的es5实现
/**
 * 
 * promise中有三个状态: pedding (执行中) resolve(执行完毕) reject(执行失败)
 * 使用settimeinterval来模拟回调
 */


function MyPromise(func) {
    this._status = MyPromise.PEDDING;
    this._value = null;
    this.resolveCb = [];
    this.exec(func);
    this.timmer = setInterval(function() {
        // 检查状态 并执行cb
    });


}

MyPromise._resolve = function(data) {
    this._status = MyPromise.RESOLVED;
    this._value = data;
};

MyPromise._reject = function(err) {
    this._status = MyPromise.REJECTED;
    this._value = err;
};

MyPromise.prototype.exec = function(func) { // promise参数函数的执行
    var me = this;
    if(this._status !== MyPromise.PEDDING) {
        return;
    }
    func(MyPromise._resolve.bind(me), MyPromise._reject.bind(me));
};

MyPromise.prototype.then = function (cb) {
    this.resolveCb.push(cb);
};





MyPromise.PEDDING = 'pendding';
MyPromise.RESOLVED = 'resolved';
MyPromise.REJECTED = 'rejected';