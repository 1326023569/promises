
class Promises{
    //实现多个promise的并行且全部成功调用，如果有未成功则返回一个失败的状态
    //all方法返回一个新的promise
    //传入多个promise的数组集合
    static all(promiseData){
        // 存储成功的结果
        var resultData=[]
        // 存储失败的结果
        var rejectData=[]
        // all方法返回的新promise
        return new Promises((res,rej)=>{
            //将所有的promise对象一次执行并添加then方法
            promiseData.forEach((i)=>{
                i.then((data)=>{
                    //将每一个promise对象成功的结果存入数组
                    resultData.push(data)
                    
                    test()
                },(err)=>{
                     //将每一个promise对象失败的结果存入数组
                    rejectData.push(err)
                    testErr()
                })
            })
            //检测是否符合当前promise成功的条件
            function test(){
                if(resultData.length==promiseData.length){
                    res(resultData)
                }
            }
            //检测是否符合当前promise失败的条件
            function testErr(){
                if(rejectData.length>0){
                    rej(rejectData[0])
                }
            }
        })
    }
    static race(promiseData){
        var resultData=[]
        var rejectData=[]
        return new Promises((res,rej)=>{
            promiseData.forEach((i)=>{
                i.then((data)=>{
                    resultData.push(data)
                    test()
                },(err)=>{
                    rejectData.push(err)
                    testErr()
                })
            })
            function test(){
                if(resultData.length>0){
                    res(resultData[0])
                }
            }
            function testErr(){
                if(rejectData.length==promiseData.length){
                    rej(rejectData[0])
                }
            }
        })
    }
    //构造函数
    constructor(cb){
        //存储所有的then函数回调函数
        this.thenArr=[]
        //promise实例化时传入的参数（回调函数）
        this.cb=cb
        //用来记录递归执行then函数（每一个then函数在数组中对应的下标）
        this.count=0
        //记录then成功回调函数返回值的
        this.returnTest=null
        //绑定this
        this.resolve=this.resolve.bind(this)
        this.reject=this.reject.bind(this)
        //实例化完成，自执行应用代码（所有的应用代码全在cb函数中）
        this.cb(this.resolve,this.reject)
    }
    //递归调用成功函数
    resolve(data){
        // this.thenArr.forEach((i)=>{
        //     i.okCb(data)
        // })
        //1、resolve无返回值
        //2、resolve返回一个新的promise对象；
        //3、resolve返回一个正常数据；
        //如果上一个then函数的成功函数返回一个promise对象，则将接下来所有未执行的then函数赋给新的promise对象
        let newArr=this.thenArr.slice(this.count)
        if(this.returnTest&&this.returnTest instanceof Promises){
            newArr.forEach((i)=>{
                this.returnTest.then(i.okCb,i.errCb)
            })
            return 
            //如果上一个then函数的成功函数返回一个基本数据，则将这个数据传入所有未执行then函数的成功函数
        }else if(this.returnTest){
            this.thenArr[this.count].okCb(this.returnTest)
            //函数无返回值时的正常执行
        }else{
            this.returnTest= this.thenArr[this.count].okCb(data)
        }
        //递归累加
        this.count++
        //通过count和then函数数组的长度，来做递归的出口
        if(this.count<this.thenArr.length){
            this.resolve(data)
        }
    }
    reject(err){
        //如果失败，根据count执行当前then函数的失败函数
        this.thenArr[this.count].errCb(err)
        //如果失败的then函数下面还有未执行的then函数，则直接调用下一个then函数的成功函数
        this.count++
        if(this.count<this.thenArr.length){
            this.resolve()
        }
    }
    //收集所有的then函数的成功和失败函数，且返回this（串式调用）
    then(okCb,errCb){
        this.thenArr.push({
            okCb,
            errCb
        })
        return this
    }
}








let pro1=()=>{
    return new Promises((resolve,reject)=>{
        setTimeout(()=>{
            reject(1)
        },1000)
    })
}

let pro2=()=>{
    return new Promises((resolve,reject)=>{
        setTimeout(()=>{
            reject(2)
        },2000)
    })
}

Promises.race([pro1(),pro2()]).then((data)=>{
    console.log(data)
},(err)=>{
    console.log(err+"2344")
})



// new Promises((res,rej)=>{
//         setTimeout(()=>{
//         rej(123)
//     },1000)
// }).then((data)=>{
//     console.log(data)
// },(err)=>{
//     console.log(err+"err1")
// }).then((data)=>{
//     console.log(data)
//     return new Promises((res,rej)=>{
//         setTimeout(()=>{
//             res(456)
//         },3000)
//     }) 
// },(err)=>{
//     console.log(err)
// }) .then((data)=>{
//     console.log(data)
   
// },(err)=>{
//     console.log(err)
// })  



// new Promises((res,rej)=>{
//     setTimeout(()=>{
//         res(123)
//     },1000)
// }).then((data)=>{
//     console.log(data)
//     return new Promises((res,rej)=>{
//         setTimeout(()=>{
//             res(456)
//         },3000)
//     })
// }).then((data)=>{
//     console.log(data)
//     return 789
// }).then((data)=>{
//     console.log(data)
// })


// new Promise((res,rej)=>{
//     setTimeout(()=>{
//         res(123)
//     },1000)
// }).then((data)=>{
//     console.log(data)
//     return 456
// }).then((data)=>{
//     console.log(data)
  
// })