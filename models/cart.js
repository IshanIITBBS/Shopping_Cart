// // using file system :- 
// // const fs = require('fs');
// // const path = require('path');
// // const rootdir = require('../util/path.js')
// // const Product = require('./product.js')
// // const p = path.join(
// //   rootdir,
// //   'data',
// //   'cart.json'
// // );

// // module.exports = class Cart{
// //     static addproduct(id,productprice)
// //     {
// //         fs.readFile(p,(err,filecont)=>{
// //             let cart = { products:[], totalPrice:0};
// //             if(!err && filecont.length!=0) {  cart = JSON.parse(filecont) }
// //             let existingproductIndex = cart.products.findIndex(prod=>prod.id==id) ;
// //             if(existingproductIndex != -1)
// //                 {
// //                     cart.products[existingproductIndex].quantity += 1;

// //                 }
// //             else
// //             {
// //                 cart.products = [...cart.products,{id:id,quantity:1}]
// //             }
// //             // +productprice converts productprice from string to integer 
// //             cart.totalPrice = cart.totalPrice + +productprice
// //             fs.writeFile(p,JSON.stringify(cart),(err)=>{
// //                 console.log(err);
// //             })
// //         })
// //     }

// //     static deleteproduct(id,productprice)
// //     {
// //          fs.readFile(p,(err,filecont)=>{
// //             if(err) { return ;}
// //             const cart = JSON.parse(filecont) ;
// //             const product = cart.products.find(prod=>prod.id==id)
// //             if(!product){return ;}
// //             cart.totalPrice -= (product.quantity * productprice) ;
// //             cart.products = cart.products.filter(prod=>prod.id!==id) ;
// //             fs.writeFile(p,JSON.stringify(cart),(err)=>{
// //                 console.log(err) ;
// //             })
// //          })
// //     }

// //     static getproduct(cb)
// //     {
// //         fs.readFile(p,(err,filecont)=>{
// //             let cart = {products:[],totalprice:0}
// //             if(!err) { cart = JSON.parse(filecont);}
// //             cb(cart.products,cart.totalPrice) ;
// //         })
// //     }
// // }

// // using 

// const {Sequelize}=require('sequelize')
// const sequelize = require('../util/database')

// const Cart = sequelize.define('cart',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     totalprice:Sequelize.INTEGER 
// })

// module.exports = Cart ;