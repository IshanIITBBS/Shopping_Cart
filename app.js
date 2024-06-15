const path = require('path');
const sequelize = require('./util/database.js')
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const Product=require('./models/product.js')
const User = require('./models/user.js')
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cart.js')
const CartItem =require('./models/cart-item.js')
const Order=require('./models/order.js')
const OrderItem = require('./models/order-item.js')

// db.execute('SELECT * FROM products')
// .then(result=>{
//     console.log(result);
// })
// .catch(err=>{
//     console.log(err) ;
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(2)
    .then(user=>{
        req.user=user ; // we are adding a new parameter to rquest so that we can acces it from request anywhere
        // req.user is a sequelize object so we can do all the things with it 
        next();
    })
    .catch(err=>{console.log(err);})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order,{through:OrderItem}) ;
Order.belongsToMany(Product,{through:OrderItem}) ;
// {force:true} only for time when you want to recreate all the tables
// don't use this in dev 
sequelize.sync()
.then(result=>{
    return User.findByPk(2) ;
})
.then(user=>{
    if(!user)
        {
           return User.create({name:'ALIEN',email:'xyz@gmai.com'}) ;
        }
        return user ;// It will automatically wrap it as Promise.resolve(user)
})
.then(user=>{
    return user.createCart() ;
})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err))

