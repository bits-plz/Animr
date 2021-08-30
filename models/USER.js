var mongoose=require('mongoose')
var passLMongoose=require('passport-local-mongoose')
var userSchema=new mongoose.Schema({
    username:String,password:String
});
userSchema.plugin(passLMongoose);

module.exports=mongoose.model('User',userSchema)