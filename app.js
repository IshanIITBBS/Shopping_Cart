const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose') ;
 const session = require('express-session') ;
 const  MongoSessionConnect = require('connect-mongodb-session')
 const csruf = require('csurf')
const { doubleCsrf } = require('csrf-csrf'); 
const flash = require('connect-flash')
const errorController = require('./controllers/error');
 const Product=require('./models/product.js')
 const User = require('./models/user.js')
 const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth.js') ;
const app = express();

const MongoUri = 'mongodb+srv://Ishan:MongoDB%406077@cluster0.thxtfon.mongodb.net/shop' ;
const Mongostore = MongoSessionConnect(session);
const store = new Mongostore({
    uri : MongoUri,
    collection:'sessions' 
})


const csrfProtection = csruf() ;

// const {
//     invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
//     generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
//     validateRequest, // Also a convenience if you plan on making your own middleware.
//     doubleCsrfProtection, // This is the default CSRF protection middleware.
//   } = doubleCsrf();


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection) ;
app.use(flash()) ;

app.use((req,res,next)=>{
      if(!req.session.loggedIn)
        {
                next();
                return ;
        }
    User.findById(req.session.user._id)
    .then(user=>{
       req.user = user ;
       next();
    })
    .catch(err=>{
        console.log(err);
    })
})

app.use((req,res,next)=>{
    res.locals.loggedIn = req.session.loggedIn ;
    res.locals.csrfToken = req.csrfToken();
    next() ;
})

app.use('/admin', adminRoutes) ;
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Mongoose.connect(MongoUri)
.then(()=>{
    console.log('connected') ;
    app.listen(3000) ;
})
.catch(err=>{
    console.log(err) ;
})

