var mongoose=require('mongoose');
var animSchema=new mongoose.Schema({
    title:String,image:String,body:String,created:{type:Date,default:Date.now},
    author:{
        id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},username:String
    },
    comments:[
        {type:mongoose.Schema.Types.ObjectId,ref:'Comment'}
    ]
});
module.exports=mongoose.model('Anim',animSchema);