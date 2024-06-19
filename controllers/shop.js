const Product = require('../models/product');
// const Cart = require('../models/cart.js');
// const { where } = require('sequelize');

exports.getProducts = (req, res, next) => {
  Product.fetchall()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
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
  Product.fetchall()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  
  req.user.getCart()
    .then(products => {
      let totalprice = 0;
      for(let product of products)
        {
          totalprice += (product.price*product.quantity)
        }
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
          totalprice: totalprice 
        });
    })
    .catch(err => console.log(err))
};

exports.deleteCartproduct = (req, res, next) => {
  const prodId = req.body.productId;
  const productPrice = req.body.productPrice;
 req.user.deleteCartItem(prodId,productPrice)
 .then(result=>{
  res.redirect('/cart');
 })
 .catch(err=>{
  console.log(err);
 })
}

exports.getPostOrder=(req,res,next)=>{
 let fetchedcart ;
  req.user.getCart()
  .then(cart=>{
    fetchedcart=cart ;
    return cart.getProducts()
  })
  .then((products)=>{
      return req.user.createOrder()
              .then(order=>{
                  return order.addProducts(products.map(product=>{
                   product.orderItem = { quantity : product.cartItem.quantity } ;
                   return product ;
                 }))
              })
              .catch(err=>console.log(err))
  })
  .then(()=>{
    fetchedcart.totalprice=0;
    return fetchedcart.save();
  })
  .then(()=>{
    return fetchedcart.setProducts(null) ;
  })
  .then(result=>{
    res.redirect('/orders') ;
  })
  .catch(err=>console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
  .then(orders=>{
    res.render('shop/orders',{
       path: '/orders',
    pageTitle: 'Your Orders',
    orders:orders
    })
  })
 
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'    
  });
};
