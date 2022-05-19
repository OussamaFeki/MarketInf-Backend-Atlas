const mongoose=require('mongoose');
var Profitschema=mongoose.Schema({
    man_id:String,
    inf_id:String,
    money:{
        type:Number,
        required:true,
        default:0
    }
    
});
module.exports=mongoose.model('profit',Profitschema);