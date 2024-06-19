const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const MongoConnect = require('./util/database.js').MongoConnect
const errorController = require('./controllers/error');
 const Product=require('./models/product.js')
 const User = require('./models/user.js')
 const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('66715788c941b0bb46b7e549')
    .then(user=>{
        req.user = new User(user.name,user.email,user.cart,user._id) ;
        next();
    })
    .catch(err=>{
        console.log(err);
    })
   
})


app.use((req,res,next)=>{
    next();
})

app.use('/admin', adminRoutes) ;
app.use(shopRoutes);

app.use(errorController.get404);


MongoConnect(()=>{
    app.listen(3000);
}) 

