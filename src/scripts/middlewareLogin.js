const loginUser = require('../controllers/allController');

let checkLogin = (req, res, next) => {

    let login = loginUser.userController.loginUser(req, res);
    console.log('login =>>>> ' + req.body.user);
    res.status(200).json({ message: login });

    next();
}

module.exports = { checkLogin };