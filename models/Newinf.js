var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var newinf=mongoose.Schema({
    id_manager:{
        type:String,
        required:true
    },
    influencers:[{type:mongoose.Schema.Types.ObjectId,ref:'influencers'}],
    
    notification:{
        type:Number,
        required:false,
        default:0
    }
});
module.exports=mongoose.model('newinf',newinf);