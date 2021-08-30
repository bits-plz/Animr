////////////////////////////REQUIREMENTS
var express=require('express')
var parser=require('body-parser')
var mongoose=require('mongoose')
var methodOverride=require('method-override')
var expressSanitizer=require('express-sanitizer')
var flash=require('connect-flash')
var passport=require('passport')
var localS=require('passport-local');
var commentRoutes=require('./routes/comment');
var animrRoutes=require('./routes/anims');
var authRoutes=require('./routes/auth');
var session=require('express-session')
var MongoStore=require('connect-mongo')(session)
///////////////////////////////////SETUP

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://bits_plz:QpKqUnFS4Zy2BdF@cluster0-g1011.mongodb.net/test?retryWrites=true&w=majority'
var app=express()
/////express setup others

////////////////////////////////SERVER
const PORT = process.env.PORT || 3000

async function main(){
  app.use(parser.urlencoded({extended:true}));
  app.use(expressSanitizer())
  app.set('view engine' , 'ejs');
  app.use(express.static('public')); 
  app.use(methodOverride('_method'));
  
  mongoose.set('useUnifiedTopology',true);
  mongoose.connect(DATABASE_URL,{useNewUrlParser:true});
  app.use(session({
    secret:'RustyIsTheBest and cutest dog',
    resave:true,saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection,ttl:2*24*60*60})
  }))
  
  
  app.set('view engine','ejs');
  
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  var User= require('./models/USER')
  passport.use(new localS(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error')
    res.locals.success=req.flash('success')
    next();
  })
  ////////////////////////////////REST routes
  app.use('/anim',animrRoutes);
  app.use('/anim/:id/comments',commentRoutes);
  app.use(authRoutes)


  app.listen(PORT,()=>console.log('running on port 3000........'))

}
main().catch(err => console.log(err))

