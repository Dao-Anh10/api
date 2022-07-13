const express = require('express');
const dotenv = require('dotenv').config();
const routerCourse = require('../src/routers/router');
const connnectdb = require('../src/config/connectdb');

const app = express();
const PORT = process.env.PORT || 3000;

connnectdb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routerCourse);

app.listen(3000, () => {
    console.log('Server is running at port: ' + PORT);
});
