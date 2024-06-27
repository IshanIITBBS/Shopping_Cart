const Product = require('../models/product');
const Order = require('../models/order')
const User = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        loggedIn:req.session.loggedIn
      });
    })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail',
         { product: product, 
          pageTitle: product.title, 
          path: '/products',
          loggedIn:req.session.loggedIn
         });
    })
    .catch(err => console.log(err));
}

exports.postcart = (req, res, next) => {
  const prodId = req.body.productId ;
  Product.findById(prodId)
  .then(product=>{
    return req.user.addToCart(product) ;
  })
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err) ;
  })
}

exports.getIndex = (req, res, next) => { 
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        loggedIn:req.session.loggedIn
      });
    })
    .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    let totalprice = 0;  let products=[] ;
    req.user.populate('cart.items.productId')
    .then(user => {
       products = user.cart.items ;
      products = products.filter(p=>{
        return p.productId!=null 
      }) ;
      user.cart.items = products ;
      return user.save() ;
    })
    .then(result=>{

      for(let product of products)
        {
          totalprice += (product.productId.price*product.quantity)
        }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalprice: totalprice,
        loggedIn:req.session.loggedIn
      });
    })
    .catch(err => console.log(err))
 
};

exports.deleteCartproduct = (req, res, next) => {
  const prodId = req.body.productId;
 req.user.deleteCartItem(prodId)
 .then(result=>{
  res.redirect('/cart');
 })
 .catch(err=>{
  console.log(err);
 })
}

exports.getPostOrder=(req,res,next)=>{
  req.user.populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i=>{
      return { quantity : i.quantity , product:{...i.productId._doc} }
    })
    const order = new Order({
       items:products ,   
      
      user : {
        email:req.user.email,
        userId:req.user._id  
      }
    })
    return order.save() ;
  })
  .then(result=>{
    return req.user.clearCart();
  })
  .then(result=>{
    res.redirect('/orders') ;
  })
  .catch(err=>{console.log(err);})
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
    res.render('shop/orders',{
       path: '/orders',
    pageTitle: 'Your Orders',
    orders:orders,
    loggedIn:req.session.loggedIn
    })
  })
  .catch(err=>{
    console.log(err) ;
  })
 
};

exports.getloginreq = (req,res,next)=>{
  res.render('shop/loginreq',{
    pageTitle : 'Login required',
    path:'/loginreq',
    loggedIn:req.session.loggedIn
  }) ;
}
// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'    
//   });
// };
