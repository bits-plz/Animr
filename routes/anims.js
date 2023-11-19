var express=require('express');
var router=express.Router();
var Anim=require('../models/anim');
var request=require('request')
router.get('/',(req,res)=>{
    Anim.find({},(err,anims)=>{
        if(err) {
            console.log(err)
        }
        else{
            res.render('index',{anims:anims})
        }
    })

})

const API_KEY = process.env.API_KEY
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('new',{author:req.user});
})
router.post('/',(req,res)=>{
   var body=req.sanitize(req.body.anim.body);
    var image=req.sanitize(req.body.anim.image);
    var title=req.sanitize(req.body.anim.title);
    var author={id:req.user._id,username:req.user.username}
    var newAnim={title:title,image:image,body:body,author:author}
    Anim.create(newAnim,(err,anim)=>{
            if(err){
                req.flash('error',"OOOOPS COULDN'T DO THAT")
                res.render('new');
            }
            else{
                req.flash('success','successfully created')
                res.redirect('/anim');
            }
        })
})
router.get('/whatsin',(req,res)=>
{
    res.render('whatsin')
})
////////special routes
router.get('/anime',(req,res)=>{
    const options = {
        method: 'GET',
        url: 'https://jikan1.p.rapidapi.com/top/anime/1/upcoming',
        headers: {
          'x-rapidapi-host': 'jikan1.p.rapidapi.com',
          'x-rapidapi-key': API_KEY,
          useQueryString: true
        }
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(response.statusCode == 200 )return  res.render('anime',{anims:JSON.parse(body).top})
        req.flash('error',"COULDN'T REQUEST THE API")
        return res.render('err');
    
        
    });

})


/////////////end special routes
router.get('/:id',(req,res)=>{
    Anim.findById(req.params.id).populate('comments').exec((err,foundanim)=>{
        if(err){
            res.redirect('/anim');
        }else{
            res.render('show',{anim:foundanim});
        }
    })})

router.get('/:id/edit',isAuthor,(req,res)=>{
    Anim.findById(req.params.id,(err,foundanim)=>{
        res.render('edit',{anim:foundanim})
    })
})
router.delete('/:id',isAuthor,(req,res)=>{
    Anim.findOneAndDelete({_id:req.params.id},(err)=>{
        if(err){
            req.flash('error',"COULDN'T DELETE")
        }
        else{
            req.flash('success','DELETED SUCCESSFULY');
        }
        res.redirect('/anim')
    })
})
router.put('/:id',isAuthor,(req,res)=>{
    Anim.findOneAndUpdate({_id:req.params.id},req.body.anim,(err,update)=>{
        if(err){
            req.flash('error','SORRY COULD NOT UPDATE')
            res.redirect('/anim');
        } 
        else{
            req.flash('success','EDITTED SUCCESSFULLY')
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
        Anim.findById(req.params.id,(err,foundanim)=>{
            if(err){
                req.flash('error','ANIM NOT FOUND')
               return res.redirect('back');
            }
            else{
                if(foundanim.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error','YOU CANNOT DO THAT');
                    res.redirect('back');
                }
            }
    })}
}
module.exports=router
