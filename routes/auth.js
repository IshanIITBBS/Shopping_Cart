const express = require('express') ;
const authcontroller = require('../controllers/auth')
const logincheck = require('../middleware/logincheck').logincheck ;
const router = express.Router() ;

router.get('/login',authcontroller.getlogin) ;
router.post('/login',authcontroller.postlogin) ;
router.post('/logOut',logincheck,authcontroller.postlogOut) ;
router.get('/signup',authcontroller.getsignup) ;
router.post('/signup',authcontroller.postsignup);
module.exports = router ;