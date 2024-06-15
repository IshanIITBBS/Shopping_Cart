// prduct model using File system :- 

const { deleteproduct } = require("./cart");

// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart.js')
// const rootdir = require('../util/path.js')


// const p = path.join(
//  rootdir,
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id,title, imageUrl, description, price) {
//     this.id = id ;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     if(this.id)
//       {
//            getProductsFromFile(products=>{
//             const existingproductIndex = products.findIndex(prod=>prod.id===this.id) ;
//             products[existingproductIndex]=this ;
//             fs.writeFile(p, JSON.stringify(products), err => {
//               console.log(err);
//             });
//            })
//       }
//       else
//       {
//         this.id = Math.random().toString();
//         getProductsFromFile(products => {
//           products.push(this);
//           fs.writeFile(p, JSON.stringify(products), err => {
//             console.log(err);
//           });
//         });
//       }
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static findById(id,cb){
//    getProductsFromFile((products)=>{
//        const product = products.find(prod=> prod.id==id) ;
//        cb(product) ;
//    })
//   }

//   static delete(id){
//     getProductsFromFile((products)=>{
//       const product = products.find(prod=>prod.id==id) ;
//        products = products.filter(p=> p.id !== id) ;
//       fs.writeFile(p,JSON.stringify(products),(err)=>{
//         console.log(err) ;
//         if(!err)
//           {
//             Cart.deleteproduct(id,product.price) ;
//           }
//       })
//   })
//   }

// };

// product model using mysql :-

// const db = require('../util/database.js') ;

// module.exports = class Product{

//   constructor(id,title, imageUrl, description, price) {
//         this.id = id ;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//       }
    
//       save()
//       {
//           return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUE(?,?,?,?)',[this.title,this.price,this.imageUrl,this.description])
//       }

//       static fetchAll()
//       {
//          return db.execute('SELECT * FROM products') ; 
//       }
     
//       static findById(prodId)
//       {
//         return db.execute('SELECT * FROM products WHERE id = ?',[prodId])
//       }


//       static delete()
//       {

//       }
// }

// product Model using sequelize :- 

const Sequelize = require('sequelize') ;
const sequelize = require('../util/database.js')

const Product = sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER ,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  title:Sequelize.STRING,
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false,
  },
  imageUrl:{
    type:Sequelize.STRING(10000),
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }
})

module.exports = Product ;