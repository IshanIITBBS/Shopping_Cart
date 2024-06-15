const { where } = require('sequelize');
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
    // Product.findById(prodId,(product)=>{

    //   if(!product) { res.redirect('/'); return ;}

    //   res.render('admin/add-product',{
    //     pageTitle: 'Edit Product',
    //     path: '/admin/edit-product',
    //     formsCSS: true,
    //     productCSS: true,
    //     activeAddProduct: true,
    //     editing:editMode ,
    //     product:product
    //   })

    // })

    // with sequelizer
    Product.findByPk(prodId)
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
    // const product = new Product(prodId,title,imageUrl,desc,price) ;
    // product.save();
    // res.redirect('/products') ;

    // with sequelizer :-
    Product.findByPk(prodId)
    .then(product=>{
      product.title=title;
      product.price=price;
      product.imageUrl=imageUrl;
      product.description=desc ;
      return product.save();
    })
    .then(result=>{
      res.redirect('/') ;
    })
    .catch(err=>console.log(err))
   
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // without using sequelizer
  // const product = new Product(null,title, imageUrl, description, price);
  // product.save()
  // .then(res.redirect('/'))
  // .catch(err=>console.log(err))

  // with sequilizer :-
  req.user.createProduct({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description
  })
  .then(()=>{console.log('Created'); res.redirect('/')})
  .catch(err=>console.log(err))
};

exports.getProducts = (req, res, next) => {
  // without sequelizer :-

  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });

  // with sequelizer :_
 req.user.getProducts()
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
  Cart.findAll({include:{
    model:Product,
    where : {id : prodId}
  }})
  .then(carts=>{
    console.log(carts) ;
    let promiseChain = Promise.resolve() ;
      for(let cart of carts)
        {
          promiseChain = promiseChain
          .then(()=>cart.getProducts({where:{id:prodId}})) 
          .then(products=>{
            const product=products[0];
            cart.totalprice -= (product.cartItem.quantity*product.price) ;
            return cart.save();
          })
          .catch(err=>console.log(err))
        }
        return promiseChain ;
  })
  .then(()=>{
        return  Product.destroy({where:{id:prodId}}) ;
  })
  .then(result=>{
    res.redirect('/products') ;
  })
  .catch(err=>{console.log(err)})
}