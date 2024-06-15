// Without sequelize :-

// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'Ishan@6077'
 
// })
// module.exports = pool.promise() ;

// With sequelize :-

const {Sequelize} = require('sequelize') 

const sequelize =  new Sequelize('node-complete','root','Ishan@6077',{dialect:'mysql', host:'localhost'});


module.exports = sequelize ;



