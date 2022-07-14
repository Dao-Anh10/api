const { json } = require('body-parser');
const loginUser = require('../controllers/allController');
const jwt = require('jsonwebtoken');

let checkLogin = (req, res, next) => {
    try {
        // let login = loginUser.userController.loginUser(req, res);
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCSESS_TOKEN , (err, user) => {
            return user ?  (
                req.uxoId = user,
                next()
            ) : res.status(401).json({ message: 'Token is wrong' });
        });
    } catch (err) {
        res.status(500),json({ message: err });
    }
}

module.exports = { checkLogin };   