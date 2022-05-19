const mongoose= require("mongoose");

var pubschema=mongoose.Schema({
  id_pub:{
      type:String,
      required:true
  },
  imageUrl:{
      type:String,
      required:false,
      default:null
  },
  id_manager:{
    type:String,
    required:false
}
})
module.exports=mongoose.model('pub',pubschema)