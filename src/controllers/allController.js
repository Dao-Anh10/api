const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const courseModel = require('../models/courseModel');
const User = require('../models/userModel');
const userModel = require('../models/userModel');

let courseController = {
    getAllCourse: async (req, res) => {
        try {
            let listCourses = await courseModel.find();
            res.status(200).json({ message: 'Done', result: listCourses });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn addCourse', error: err });
            console.log(err);
        }
    },
    getCourseById: async (req, res) => {
        try {
            let course = await courseModel.findById(req.params.idd);
            console.log(course);
            res.status(200).json({ message: 'Done', result: course });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn addCourse', error: err });
            console.log(err);
        }
    },
    addCourse: async (req, res) => {
        try {
            let newCourse = new courseModel(req.body);
            let saveCourse = await newCourse.save();
            res.status(200).json({ message: 'Add Done', result: newCourse });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn addCourse', error: err });
            console.log(err);
        }
    },
    updateCourse: async (req, res) => {
        try {
            let course = await courseModel.findById(req.params.ids);
            await course.updateOne({ $set: req.body });
            res.status(200).json({ message: 'Update Done', result: await courseModel.findById(req.params.ids) });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn updateCourse', error: err });
            console.log(err);
        }
    },
    deleteCourse: async (req, res) => {
        try {
            let course = await courseModel.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Delete Done', result: course });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn deleteCourse', error: err });
            console.log(err);
        }
    },
    deleteAllCourse: async (req, res) => {
        try {
            let delAllCourses = await courseModel.deleteMany({});
            res.status(200).json({ message: 'Delete All Done' });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn deleteAllCourse', error: err });
            console.log(err);
        }
    },
};

let userController = {
    registerUser: async (req, res) => {
        try {
            let { user, pass } = req.body;

            if (!user || !pass) {
                return res.status(400).json({ message: 'Please enter user and pass' });
            }

            let checkUser = await User.findOne({ username: user });
            if (checkUser) {
                return res.status(400).json({ message: 'User already taken' });
            }

            let hashPass = await argon2.hash(pass);
            let newUser = new User({ username: user, password: hashPass });
            let saveUser = await newUser.save();

            //return token
            const accsessToken = jwt.sign({ userId: newUser._id }, 'abcxyz');
            console.log(accsessToken);
            res.status(200).json({ message: 'Register Done', result: newUser, accsessToken });

        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn registerUser', error: err });
            console.log(err);
        }
    },
    loginUser: async (req, res) => {
        try {
            let user = req.body.user;
            let pass = req.body.pass;
    
            let checkUser = await User.findOne({ username: user });
            console.log(user + ' vv ' + pass);
            if (checkUser) {
                let checkPass = await argon2.verify(checkUser.password, pass);
                return checkPass ? res.status(200).json({ message: 'Login successed', result: checkUser })
                                : res.status(401).json({ message: 'Login failed' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn registerUser', error: err });
            console.log(err);
        } 
    }
};
module.exports = { courseController, userController }; 
 