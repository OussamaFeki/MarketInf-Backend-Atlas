var products=require('../models/Products');
var fs =require('fs')
var filepath='./uploads/'
addProduct=function(name,mark,image,description,price,tag,id){
    return new Promise((resolve,reject)=>{
        products.findOne({tag:tag,id_manager:id},(err,res)=>{
            if (res){
                reject('this tag is already used')   
               }
           else{
        let newProduct=new products({
            name,
            mark,
            description,
            price,
            tag,
            id_manager:id 
        });
        if(image){
            newProduct.image=`http://localhost:3000/image/${image.filename}`
        }
        newProduct.save((err,doc)=>{
            if(err){
                reject('all inputs is required')
            }else{
                resolve(doc)
            }
        }) }
    })
    })  
}
getallProd=function(){
    return new Promise((resolve,reject)=>{
        products.find({},(err,doc)=>{
            if (err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })
}
deleteProd=function(id){
    return new Promise((resolve,reject)=>{
        products.findOneAndDelete({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                imagename=doc.image.slice(28)
                fs.unlink(filepath+imagename,(err)=>{
                     if(err){
                         reject('error in deleting file')
                     }
                     else{
                         console.log('deleted succesfully')
                     }
                 })
                
                resolve(doc)
            }
        })
    })
}
getnameimage=function(id){
    products.findOneAndDelete({_id:id},(err,doc)=>{
            if(err){
                console.log(error)
            }else{imagename=doc.image.slice(28)
                return imagename
            }
            
        })
    
}
getone=function(id){
 return new Promise((resolve,reject)=>{
     products.findOne({_id:id},(err,doc)=>{
         if(err){
             reject(err)
         }
         else{
             resolve(doc)
         }
     })
 })
}
updateProd=function(id,name,mark,image,description,price){
    return new Promise((resolve,reject)=>{
        if(image!=null){products.findOne({_id:id},(err,doc)=>{
            if(err){
                console.log('error of foundation')
            }else{
                imagename=doc.image.slice(28)
                fs.unlink(filepath+imagename,(err)=>{
                     if(err){
                         reject('error in deleting file')
                     }
                     else{
                         console.log('deleted succesfully')
                     }
                 })
            }
        })
        products.updateOne({_id:id},{name,mark,
            image:`http://localhost:3000/image/${image.filename}`   
            ,description,price},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })}
        else{
            products.updateOne({_id:id},{name,mark   
                ,description,price},(err,doc)=>{
                if(err){
                    reject(err)
                }
                else{
                    resolve(doc)
                }
            })
        }
        
    })

}
getprodofman=function(id){
  return new Promise((resolve,reject)=>{
      products.find({id_manager:id},(err,doc)=>{
        if(err){
            reject(err)
        }
        else{
            resolve(doc)
        }
    })
  })
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
search=function(name){
    return new Promise((resolve,reject)=>{
        if(name) {
            const regex = new RegExp(escapeRegex(name), 'gi');
            products.find({name:regex},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        } else {
            products.find({},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        }
    })
}
searchforman=function(name,manid){
    return new Promise((resolve,reject)=>{
        if(name) {
            const regex = new RegExp(escapeRegex(name), 'gi');
            products.find({name:regex},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        } else {
            products.find({id_manager:manid},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        }
    })
}
deletprodsofman=function(id){
    return new Promise((resolve,reject)=>{
        products.find({id_manager:id},(err,doc)=>{
            if(err){
                reject (err)
            }else{
                let imagename=[]
                for(i in doc){
                 imagename[i]=doc[i].image.slice(28)
                 fs.unlink(filepath+imagename[i],(err)=>{
                      if(err){
                          reject('error in deleting file')
                      }
                      else{
                          console.log('deleted succesfully')
                      }
                  })  
                }
                products.deleteMany({id_manager:id},(err,doc)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(doc)
                    }
                })
            }
        })
        
    })
}
module.exports={
    getallProd,
    addProduct,
    getone,
    deleteProd,
    updateProd,
    getprodofman,
    getnameimage,
    deletprodsofman,
    search,
    searchforman
}