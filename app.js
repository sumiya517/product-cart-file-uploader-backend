const express = require('express');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { failure } = require('./utils/commonResponse');
const HTTP_STATUS = require('./utils/httpStatus');
const dotenv = require('dotenv')

const User = require('./models/user')

const app = express();
dotenv.config();

const databaseConnection = require('./config/database');
const mongodb = require('mongodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('629f1ea57ec95d0200c0f120');
        next();
    } catch (error) {
        console.log(error);
        next(error)
    }
})

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use((req, res, next) => {
    res.status(HTTP_STATUS.NOT_FOUND).send(failure('NOT FOUND'));
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(
        failure('Internal Server Error!', err.message)
    );
});

databaseConnection(() => {
    User.find().then(user =>{
        if(!user.length ){
            const newUser = new User({name: "Sumiya", email: "sumiya@gmail.com", phone : "01223333331"});
            newUser.save()
            .then(res=> {console.log(res)})
            .catch(err=>{console.log(err)})
        }
    })
    app.listen(6000, () => {
        console.log('Application is running on 6000');
    });
})
