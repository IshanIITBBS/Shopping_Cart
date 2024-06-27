const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getlogin = (req,res,next)=>{
    let errorMessage = req.flash('error');
    if(errorMessage.length>0)
        {
            errorMessage = errorMessage[0];
        }
        else
        {
            errorMessage = null ;
        }
     res.render('auth/login',{
        pageTitle:'login' ,
        path:'/login',
        loggedIn:req.session.loggedIn,
        error:errorMessage 
     })
}

exports.postlogin =(req,res,next)=>{
     const email = req.body.email ;
     const password = req.body.password ;
    User.findOne({email:email})
    .then(user=>{
        if(!user)
            {
                req.flash('error','Invalid email or password') ;
               return  req.session.save((err)=>{
                   res.redirect('/login') ;
               })
                        
            }
           return bcrypt.compare(password,user.password)
                  .then(match=>{
                    if(!match)
                        {
                            req.flash('error','Invalid email or password') ;
                            return  req.session.save((err)=>{
                                res.redirect('/login') ;
                            })
                        }
                        req.session.loggedIn = true ;
                        req.session.user = user ;
                        req.session.save(err=>{           
                               if(err) {console.log(err) ;}
                               res.redirect('/');
                           }) ;
                  })      
    })
    .catch(err=>{
        console.log(err) ;
    })
}

exports.postlogOut = (req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) {console.log(err) ;}
        res.redirect('/');
    })
}

exports.getsignup = (req,res,next)=>{
    let errorMessage = req.flash('error') ;
    if(errorMessage.length>0)
        {
            errorMessage = errorMessage[0] ;
        }
        else
        {
            errorMessage = null ;
        }
    res.render('auth/signup',{
        pageTitle:"Sign Up",
        path:'/signup',
        loggedIn:req.session.loggedIn,
        error : errorMessage
    })
}

exports.postsignup = (req,res,next)=>{
    const email = req.body.email ;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword ;
    if(password != confirmPassword )
        {
            req.flash('error',"Password doesn't match ( Confirmation failed ) ") ;
             req.session.save((err)=>{
              res.redirect('/signup') ;
              })
              return ;
        }
    User.findOne({email:email})
    .then(user=>{
        if(user)
            {
                 req.flash('error','Email already exists') ;
                 return  req.session.save((err)=>{
                   res.redirect('/signup') ;
                   })
            }
        return bcrypt.hash(password,12)
                   .then(hashedpassword=>{
                    user = new User({
                        email:email,
                      password:hashedpassword,
                      cart:{items : []}
                    })
                    return user.save() ;
                   })
                    .then(result=>{
                        res.redirect('/login');
                    })
    })
    .catch(err=>{
        console.log(err) ;
    })
}