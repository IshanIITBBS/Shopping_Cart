const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing:false,
    loggedIn:req.session.loggedIn
  });
};

exports.editproduct = (req,res,next)=>{
   const editMode = req.query.edit ;
   if(!editMode) 
    {
      res.redirect('/') ;
      return ;
    }
    const prodId = req.params.productId ;
    Product.findById(prodId)
    .then((product)=>{
      if(!product) { res.redirect('/'); return ;}
      res.render('admin/add-product',{
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing:editMode ,
        product:product,
        loggedIn:req.session.loggedIn
      })

    })
    .catch(err=>console.log(err))
}

exports.posteditProduct=(req,res,next)=>{
    const prodId = req.body.productId ;
    const title = req.body.title ;
    const imageUrl = req.body.imageUrl ;
    const price = req.body.price ;
    const desc = req.body.description ;
     Product.findById(prodId)
     .then(product=>{
      product.title = title ;
      product.imageUrl = imageUrl;
      product.price = price ;
      product.description = desc ;
      return product.save() ;
     })
    .then(result=>{
      res.redirect('/') ;
    })
    .catch(err=>{
      console.log(err) ;
    })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description,
    UserId:req.user._id 
  }) ;
  product.save()
  .then(result=>{
    res.redirect('/') ;
  })
  .catch(err=>{
    console.log(err) ;
  })
};

exports.getProducts = (req, res, next) => {
Product.find({"UserId":req.user._id})
  .then(products=>{
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      loggedIn:req.session.loggedIn
    });
  })
  .catch(err=>console.log(err))
};


exports.deleteproduct = (req,res,next)=>{
  const prodId = req.body.productId ;
  Product.findByIdAndDelete(prodId)
  .then(result=>{
     res.redirect('/') ;
  })
 .catch(err=>{
  console.log(err) ;
 })
}