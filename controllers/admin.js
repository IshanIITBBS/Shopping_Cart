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
    editing:false
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
        product:product
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
    const product = new Product(title,imageUrl,price,desc,prodId,req.user._id) ;
    product.save()
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
  const product = new Product(title,imageUrl,price,description,null,req.user._id) ;
  product.save()
  .then(result=>{
    res.redirect('/') ;
  })
  .catch(err=>{
    console.log(err) ;
  })
};

exports.getProducts = (req, res, next) => {
 Product.fetchall()
  .then(products=>{
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err))
};


exports.deleteproduct = (req,res,next)=>{
  const prodId = req.body.productId ;
  Product.deleteById(prodId)
  .then(result=>{
     res.redirect('/') ;
  })
 .catch(err=>{
  console.log(err) ;
 })
}