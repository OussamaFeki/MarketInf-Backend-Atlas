const profit=require('../models/profit')
getprof=function(id_man,id_inf){
    return new Promise((resolve,reject)=>{
        profit.findOne({id_man,id_inf},(err,res)=>{
         if(err){
             reject(err)
         }else{
             resolve(res)
         }
        })
    })
}
gettotalprofofinf=function(id_inf){
    return new Promise((resolve,reject)=>{
        profit.find({id_inf},(err,res)=>{
            if(err){
                reject(err)
            }else{
                var total=0
                for(let group of res){
                    total=total+group.money     
                }
                resolve(total)
            }
        })
    })

}
payer=function(id_man,id_inf,rest,increase){
    return new Promise((resolve,reject)=>{
        if(increase>0){
            if(increase>rest){
                reject('you have to pay properly')
            }else{
                profit.findOneAndUpdate({id_man,id_inf},{$inc:{money:increase}},(err,doc)=>{
                    if(err){
                        reject(err)
                    }else{
                        profit.findOne({id_man,id_inf},(erro,res)=>{
                            if(erro){
                                reject(erro)
                            }else{
                                resolve(res)
                            }
                            
                        })
                    }
                   
                })
            } 
        }else{
            reject('you have to pay properly')
        }
       
    })
}
module.exports={
    getprof,
    gettotalprofofinf, 
    payer
}