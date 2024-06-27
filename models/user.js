const mongoose = require('mongoose') 

const Schema = mongoose.Schema ;

const User = new Schema({
    email:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true 
    },
    cart :{
        items :[{
             productId :{
                type : Schema.Types.ObjectId,
                ref:"Product",
                required:true 
            },
            quantity:{
                type :Number,
                required:true 
            }
        }]
    }

})

User.methods.addToCart = function(product){
    let cart = { items : []} ;
           if(this.cart)
            {
                cart=this.cart ;
            }  
            let cartproductIndex = cart.items.findIndex(item=>{    
               return   item.productId.toString()==product._id.toString(); 
            })
            if(cartproductIndex!=-1)
                {
                    cart.items[cartproductIndex].quantity += 1 ;
                }
             else
             {
                cart.items.push({productId : product._id,
                    quantity:1                 
                })
             }
           this.cart = cart ;
           return this.save();
}

User.methods.deleteCartItem = function(prodId)
{
       this.cart.items = this.cart.items.filter(item=>{ 
        return item.productId != prodId ;
        })
    //    console.log(this.cart.items) ;
        return this.save();        
}

User.methods.clearCart = function()
{
    this.cart.items=[];
    this.save();
}
module.exports = mongoose.model('User',User) ;
// const getdb = require('../util/database').getdb ;
// const mongodb = require('mongodb') ;
// module.exports= class User {

//     constructor(name,email,cart,id)
//     {
//         this.name = name ;
//         this.email = email ;
//         this.cart = cart ;
//         this._id = id ;
//     }

//     save()
//     {
//         const db = getdb() ;
//         return db.collection('users').insertOne(this) ;
//     }

//     static findById(userid)
//     {
//        const db = getdb() ;
//        return db.collection('users').findOne({_id: mongodb.ObjectId.createFromHexString(userid)});
//     } 

//     addToCart(product)
//     {
//        let cart = { items : []} ;
//        if(this.cart)
//         {
//             cart=this.cart ;
//         }  
//         let cartproductIndex = cart.items.findIndex(item=>{    
//            return   item.productId.toString()==product._id.toString(); 
//         })
//         if(cartproductIndex!=-1)
//             {
//                 cart.items[cartproductIndex].quantity += 1 ;
//             }
//          else
//          {
//             cart.items.push({productId : product._id,
//                 quantity:1                 
//             })
//          }
//          const db=getdb();
//        return db.collection('users').updateOne({_id:this._id},
//         {$set : {cart : cart}}) 
//     }

   
//     getCart()
//     {
//            let prodIds = this.cart.items.map(item=>{
//             return item.productId ;
//            })
//            const db = getdb() ;
//           return db.collection('products').find({_id:{$in : prodIds}}).toArray()
//            .then(products=>{
//                return products.map(p=>{
//                 return {...p,quantity:this.cart.items.find(k=>{
//                     return k.productId.toString()==p._id.toString();
//                 }).quantity}
            
//                })
//            })
//     }

//     deleteCartItem(prodId,prodPrice)
//     {
//         let cart = this.cart ;
//          let deleteditem ;
//          cart.items = cart.items.filter(item=>{
//             if(item.productId == prodId )
//              {
//              deleteditem  = item ;
//              }
//             return item.productId != prodId 
//           })
//         cart.totalprice -= (prodPrice*deleteditem.quantity) ;
//         const db = getdb() ;
//        return db.collection('users').updateOne({_id:this._id},{$set:{cart:{items:cart.items,totalprice : cart.totalprice}}})
//     }

//     addOrder()
//     {
//         const db = getdb();
//        return this.getCart()
//         .then(products=>{
//             const order = {
//                 items :products ,
//                 user :{
//                     _id : this._id ,
//                     name : this.name 
//                 }
//             } ;
//             return db.collection('orders').insertOne(order) ;
//         })
//         .then(()=>{
//             return db.collection('users').updateOne({_id:this._id},{$set:{ cart:{items :[]}}}) ;
//         })
//     }

//     getOrders()
//     {
//         const db = getdb();
//         return db.collection('orders').find({'user._id':this._id}).toArray() ;
//     }
// }