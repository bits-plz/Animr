var express=require('express');
var router=express.Router({mergeParams:true});
var Anim=require('../models/anim');
var Comment=require('../models/comments');
///////Comments
router.get('/new',isLoggedIn,(req,res)=>{
    Anim.findById(req.params.id,(err,foundanim)=>{
        if(err){
            res.redirect('/anim/'+req.params.id);
        }else{
            res.render('newc',{anim:foundanim});
        }
    })
})
router.post('/',isLoggedIn,(req,res)=>{
    Anim.findOne({_id:req.params.id},(err,anim)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            var text=req.sanitize(req.body.comment);
            var author={id:req.user.id,username:req.user.username}
            var newcomment={text,author};
            Comment.create(newcomment,(err,comment)=>{
                if(err){
                    console.log(err);
                }
                else{
                    comment.save();
                    anim.comments.push(comment);
                    anim.save();
                    res.redirect('/anim/'+req.params.id);
                }
            })
        }
    })
    
})
router.get('/:comment_id/edit',isAuthor,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundcomment)=>{
        if(err){
            res.redirect('back');
        }
        else{
            res.render('editcomm',{anim_id:req.params.id,comment:foundcomment});
        }
    })
})
router.delete('/:comment_id',isAuthor,(req,res)=>{
    Comment.findOneAndDelete({_id:req.params.comment_id},(err)=>{
        if(!err){
            res.redirect('/anim/'+req.params.id);
        }
        else{
            console.log(err)
            res.redirect('back');
        }
    })
})
router.put('/:comment_id',isAuthor,(req,res)=>{
    Comment.findOneAndUpdate({_id:req.params.comment_id},req.body.comment,(err,update)=>{
        if(err){ 
            req.flash('error','ALAS! COULD NOT UPDATE ')
            res.redirect('back');}
        else{
            req.flash('success','EDITED SUCCESSFULLY')
            res.redirect('/anim/'+req.params.id);
        }
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
        }
        req.flash('error','YOU NEED TO LOGIN TO DO THAT');
        res.redirect('/login')
}
function isAuthor(req,res,next){
    if(req.isAuthenticated()){
        Comment.findOne({_id:req.params.comment_id},(err,comment)=>{
            if(err){
                console.log(err);return res.redirect('back');
            }
            else{
                if(comment.author.id.equals(req.user._id)){
                   return next();
                }
                else{
                    res.redirect('back');
                }
            }})}}
module.exports=router