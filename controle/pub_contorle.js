const pub =require('../models/acceptedpub')
acceptepub=function(id_pub,id_manager,imageUrl){
  return new Promise((resolve,reject)=>{
   let newpub=new pub({
        id_pub,
        imageUrl,
        id_manager
      })
      newpub.save((err,res)=>{
       if(err){
        reject(err)

       }else{
       resolve(res)
       }
      })
  })
    
}
findpub=function(id_pub,id_manager,imageUrl){
    return new Promise ((resolve,reject)=>{
        pub.findOne({ id_pub,imageUrl,id_manager},(err,res)=>{
            if (res){
             resolve(true)
            }else{ 
            resolve(false)}
            
        })
    })
}
refuse=function(id_pub,id_manager,imageUrl){
    return new Promise ((resolve,reject)=>{
    pub.deleteOne({id_pub,imageUrl,id_manager},(err,res)=>{
        if(err){
            reject(err)
        }
        else{
            resolve(res)
        }
    })
    })
}
module.exports={
    findpub,
    acceptepub,
    refuse
}