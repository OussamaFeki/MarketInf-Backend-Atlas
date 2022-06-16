const mongoose  = require("mongoose");
var bcrypt=require('bcrypt');
const { urlencoded } = require("express");
 inscritschema=mongoose.Schema({
     fullname:{
         type:String,
         required:true,
     },
     email:{
         type:String,
         required:true
     },
     password:{
        type:String,
        required:true 
     },
     payment:{
         type:Number,
         required:false
     }
    //  newinf:[{type:mongoose.Schema.Types.ObjectId,ref:'influencers'}]
    
})

inscritschema.methods.Hashpass=function(password){
    return(bcrypt.hashSync(password, bcrypt.genSaltSync(5), null))
};

inscritschema.methods.Compass=function(password,pass){
    return(bcrypt.compareSync(password,pass))
 };
module.exports=mongoose.model('inscrimanager',inscritschema);
