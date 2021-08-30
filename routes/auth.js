///AUTH ROUTES
var User=require('../models/USER')
var passport=require('passport')
var express=require('express');
var router=express.Router();
router.get('/',(req,res)=>{
    res.render('landing')
})
router.get('/signup',(req,res)=>{
    res.render('signup');
  })
router.post('/signup',(req,res)=>{
var nuser=new User({username:req.body.username});
User.register(nuser,req.body.password,(err,user)=>{
    if(err){
    req.flash('error',err.message)
    return res.render('signup')
    }
    passport.authenticate('local')(req,res,()=>{
    req.flash('success',"Welcome to ANIMr" +user.username)
    res.redirect('/anim');
    });
});
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',passport.authenticate('local',{successRedirect:'/anim',failureRedirect:'/login'}) ,(req,res)=>{});
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','loggged u out');
    res.redirect('/anim')
})

module.exports=router
  
  