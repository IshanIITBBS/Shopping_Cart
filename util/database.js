// const mongodb = require('mongodb') ;
// const MongoClient = mongodb.MongoClient ;

// let _db ;

// const MongoConnect = cb=>{
//     MongoClient.connect('mongodb+srv://Ishan:MongoDB%406077@cluster0.thxtfon.mongodb.net/')
//     .then(client=>{
//         console.log('connected');
//         _db = client.db();
//         cb();
//     })
//     .catch(err=>{
//         console.log(err);
//         throw err  ;
//     })
// }

// const getdb = ()=>{
//     if(_db)
//         {
//             return _db ;
//         }
//         throw 'No DataBase Found' 
// }


// exports.MongoConnect = MongoConnect ;
// exports.getdb = getdb ;