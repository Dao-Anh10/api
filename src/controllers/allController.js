const argon2 = require('argon2');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Course = require('../models/courseModel');
const { findById } = require('../models/courseModel');

const courseModel = require('../models/courseModel');
const User = require('../models/userModel');
const userModel = require('../models/userModel');

let courseController = {
    getAllCourse: async (req, res) => {
        try {
            let reqUxo = req.uxoId.userId;
            let pageCur = req.query.page;
            if(!pageCur) {
                pageCur = 1;
            };
            let listCourses = await courseModel.find({}).limit(4).skip((pageCur - 1) * 4);
            console.log(reqUxo);
            let user = await User.findById(reqUxo).select('-password');
            res.status(200).json({ message: 'Done', result: listCourses, pageNumber: pageCur, user: user });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn getAllCourse', error: err });
            console.log(err);
        }
    },
    getCourseById: async (req, res) => {
        try {
            let course = await courseModel.findById(req.params.idd);
            console.log(course);
            res.status(200).json({ message: 'Done', result: course });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn getCourseById', error: err });
            console.log(err);
        }
    },
    addCourse: async (req, res) => {
        try {
            let reqUxo = req.uxoId;            
            req.body.userId = reqUxo.userId;
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
    searchCourse: async (req, res) => {
        try {
            let course = await Course.find({ name: {$regex: req.query.sea, $options: "$i"} });
            return !course ? res.status(404).json({ message: 'Not have result' }) 
                            : res.status(200).json({ message: 'Not Found', result: course });
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn searchCourse', error: err });
        }
    }

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
            const accsessToken = jwt.sign({ userId: newUser._id }, process.env.ACCSESS_TOKEN);
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
            const accsessToken = jwt.sign({ userId: checkUser._id }, process.env.ACCSESS_TOKEN);
            if (checkUser) {
                let checkPass = await argon2.verify(checkUser.password, pass);
                return checkPass ? res.status(200).json({ message: 'Done' , accsessToken}) : res.status(401).json({ message: 'Error'});
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error at fn registerUser', error: err });
            console.log(err);
        }  
    }   
};
module.exports = { courseController, userController }; 
  