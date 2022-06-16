const inscript=require('../models/inscriman')
var manager=require("../models/managers");
var influencer=require("../models/influencers");
var Admin=require('../models/Admin');
const Newinf = require("../models/Newinf");
registry=function(fullname,email,password,repass,error){
    return new Promise((resolve,reject)=>{
        Admin.findOne({email:email},(err,doc)=>{
            if(doc){reject('this email is alredy exist')}
            else{ influencer.findOne({email:email},(er,doc)=>{
                if(doc){reject('this email is alredy exist')}
                else{
                    manager.findOne({email:email},(err,doc)=>{
                    if(doc){
                    reject('this email is alredy exist')
                    }
                    else{inscript.findOne({email:email},(err,doc)=>{
                        if(doc){
                        reject('this email is alredy exist')

                        }
                        else{ 
                            if(error){ 
                            reject(error)
                            }
                            else {
        
                                let newman=new inscript({
                                    fullname,
                                    email,
                                    password:new inscript().Hashpass(password),
                                    image:null
                                })
                                    newman.save((err,doc)=>{
                                    if (err){
                                    
                                    reject(err)
                                    }
                                    else{
                                        resolve(doc);
                                        }
                                      })   
                                    }}
                    }
                    
                
           )}})}})}
            })   
        
       })
}
delinscription=function(id){
    return new Promise((resolve,reject)=>{
        inscript.findOneAndDelete({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })
}
ajouterman=function(id){
    return new Promise((resolve,reject)=>{
        inscript.findOne({_id:id},(err,res)=>{
            let newman=new manager({
              fullname:res.fullname,
              email:res.email,
              password:res.password,
              image:null
            })
            newman.save((err,doc)=>{
                if (err){
                
                reject(err)
                }
                else{
                    let boite=new Newinf({
                        id_manager:doc._id
                    })
                    boite.save((errore,resu)=>{
                     if(errore){
                         reject(errore)
                     }else{
                          inscript.deleteOne({_id:id},(erro,result)=>{
                            resolve(doc);  
                          })
                     }
                    })
                    }
                  })  
      
         })
    })
   
}
showall=function(){
    return new Promise((resolve,reject)=>{
        inscript.find({},(err,res)=>{
        if(err){
            reject(err)
        }else{
            resolve(res)
        }
        })
    })
   
}
module.exports={
    registry,
    delinscription,
    ajouterman,
    showall
}