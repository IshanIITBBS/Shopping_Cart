const Product = require('../models/product');
const Cart = require('../models/cart.js');
const { where } = require('sequelize');

exports.getProducts = (req, res, next) => {
  // without sequelizer 
  // Product.fetchAll()
  // .then(([products,fielddata])=>{
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'Products',
  //     path: '/products'
  //   });
  // })
  // .catch(err=>{
  //   console.log(err);
  // })

  // with sequelizer :-
  Product.findAll()
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
  // without using sequelizer 
  //   Product.findById(prodId)
  //   .then(([product,fielddata])=>{
  //     res.render('shop/product-detail',{product:product[0],pageTitle:product.title,path:'/products'})
  //  })
  //  .catch(err=>console.log(err))

  // with sequelizer 
  Product.findByPk(prodId)
    .then(product => {
      console.log(product);
      res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    })
    .catch(err => console.log(err));
}

exports.postcart = (req, res, next) => {
  // const prodId = req.body.productId ;
  // Product.findById(prodId,(product)=>{
  //      Cart.addproduct(prodId,product.price)
  //      res.redirect('/')
  // })

  // with sequelizer :-
  const prodId = req.body.productId;
  let fetchedcart;
  req.user.getCart()
    .then(cart => {
      fetchedcart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let price; let newquantity = 1;
      if (products.length > 0) {
        newquantity += products[0].cartItem.quantity;
      }
      return Product.findByPk(prodId)
                    .then(product => {
                      price = product.price;
                      return fetchedcart.addProduct(product, { through: { quantity: newquantity } })
                    })
                    .then(result => {
                      fetchedcart.totalprice += price;
                      return fetchedcart.save();
                    })
                    .catch(err => console.log(err))
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  // without sequelizer :- 
  // Product.fetchAll()
  // .then(([products,fielddata])=>{
  //   res.render('shop/index', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // })
  // .catch(err=>{
  //   console.log(err);
  // })

  //with sequelizer :- 
  Product.findAll()
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
  // Cart.getproduct((cartproducts,totalPrice)=>{
  // Product.fetchAll((products)=>{
  //        let cartprod=[];
  //        for(let product of products)
  //         {
  //           let existingproduct = cartproducts.find(p=>p.id==product.id) ;
  //           if(existingproduct)
  //             {
  //               cartprod.push({...product,quantity:existingproduct.quantity});
  //             }
  //         }
  //         res.render('shop/cart', {
  //           path: '/cart',
  //           pageTitle: 'Your Cart',
  //           products:cartprod,
  //           totalprice:totalPrice
  //         });
  // })
  // })

  let totalprice;
  req.user.getCart()
    .then(cart => {
      totalprice = cart.totalprice;
      return cart.getProducts()
    })
    .then(cartprod => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartprod,
        totalprice: totalprice
      });
    })
    .catch(err => console.log(err))
};

exports.deleteCartproduct = (req, res, next) => {
  const prodId = req.body.productId;
  const productPrice = req.body.productPrice;
  let fetchedcart ; let quantity ;
  req.user.getCart()
  .then(cart=>{
    fetchedcart = cart ;
    return cart.getProducts({where:{id:prodId}});
  })
  .then(products=>{
    const product= products[0] ;
      quantity = product.cartItem.quantity ;
      return  product.cartItem.destroy() ;
  })
  .then(result=>{
    fetchedcart.totalprice -= quantity*productPrice ;
    return fetchedcart.save() ;
  })
  .then(result=>{
    res.redirect('/cart');
  })
 .catch(err=>{
  console.log(err)
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
