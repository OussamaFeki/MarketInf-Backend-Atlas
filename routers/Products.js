const route =require('express').Router();
const contro=require('../controle/Prod_controle');
const upload =require('../upload/upimg')
const controler =require('../controle/pub_contorle')
route.get('/products',(req,res,next)=>{
    contro.getallProd()
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
    
})
route.get('/product/:id',(req,res,next)=>{
    contro.getone(req.params.id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.post('/addprod/:id_man',upload.single('image'),(req,res,next)=>{
    contro.addProduct(req.body.name,req.body.mark,req.file,req.body.description,req.body.price,req.body.tage,req.params.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.delete('/product/:id',(req,res,next)=>{
    contro.deleteProd(req.params.id)
    .then(doc=>{res.status(200).json(doc)
    })
    .catch(err=>res.status(400).json(err))
})
route.get('/productofman/:id_man',upload.single('image'),(req,res,next)=>{
    contro.getprodofman(req.params.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.put('/update/:id',upload.single('image'),(req,res,next)=>{
    contro.updateProd(req.params.id,req.body.name,req.body.mark,req.file,req.body.description,req.body.price)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.delete('/prodmans',(req,res)=>{
    contro.deletprodsofman(req.query.man_id)
    .then(doc=>{res.status(200).json(doc)})
    .catch(err=>res.status(400).json(err))
})
route.get('/researchprod',(req,res,next)=>{
    contro.search(req.query.fullname)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/researchforman',(req,res,next)=>{
    contro.searchforman(req.query.fullname,req.query.man_id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
// route.get('/isaccpub',(req,res,next)=>{
//     controler.findpub(req.query.id,req.query.picture)
//     .then(doc=>{
//         res.status(200).json(doc)
//         console.log(doc)
//     })
//     .catch(err=>res.status(400).json(err))
// })
module.exports=route