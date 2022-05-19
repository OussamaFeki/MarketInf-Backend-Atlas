const route =require('express').Router();
const contro =require('../controle/pub_contorle')
 route.get('/isaccpub',(req,res,next)=>{
     contro.findpub(req.query.id,req.query.id_manager,req.query.picture)
     .then(doc=>{
         res.status(200).json(doc)
     })
     .catch(err=>res.status(400).json(err))
})
route.get('/acceptpub',(req,res,next)=>{
    contro.acceptepub(req.query.pub_id,req.query.id_manager,req.query.imageUrl)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/cancel',(req,res,next)=>{
    contro.refuse(req.query.pub_id,req.query.id_manager,req.query.imageUrl)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
module.exports=route