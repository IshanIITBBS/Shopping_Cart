exports.logincheck = (req,res,next)=>{
    if(!req.session.loggedIn)
        {
           return  res.redirect('/loginreq') ;
        }
        next() ;
}