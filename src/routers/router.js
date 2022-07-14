let express = require('express');
let router = express.Router();
let { courseController, userController } = require('../controllers/allController');
const checkLogin = require('../scripts/middlewareLogin');

//get
router.get('/', checkLogin.checkLogin, courseController.getAllCourse);
router.get('/id/:idd', courseController.getCourseById);
//add
router.post('/addCourse', checkLogin.checkLogin, courseController.addCourse);
//update
router.put('/updateCourse/:ids', courseController.updateCourse);
// delete 
router.delete('/deleteCourse/:id', courseController.deleteCourse);
router.delete('/deleteAllCourse', courseController.deleteAllCourse);
//register and login
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
//serach
router.get('/search', courseController.searchCourse);


module.exports = router;



