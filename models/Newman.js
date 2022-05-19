var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var newman=mongoose.Schema({
    id_inf:{
     type:String,
     required:true
    },
    managers:[{type:mongoose.Schema.Types.ObjectId,ref:'manager'}],
    //  avatar:{
    //       data:Buffer,
    //       contentType:String,
    //       required:false
    //   }
    notification:{
        type:Number,
        required:false,
        default:0
    }
});
module.exports=mongoose.model('newman',newman);