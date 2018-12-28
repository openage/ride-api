'use strict';
var db = require('../models/index');
var auth = require('../middleware/authorization');
var mapper = require('../mappers/user');

exports.signIn = (req, res) => {
    db.user.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    }).then(admin => {
        if (!admin) {
            res.failure('wrong credentials');
        }
        return res.data(mapper.toModel(admin));
    }).catch(err => {
        return res.failure(err);
    });
    // if (req.body.username === 'admin' && req.body.password === 'admin') {
    //     return res.success('SignIn Successfully');
    // } else {
    //     return res.failure('User Not Found');
    // }
};

exports.create = (req, res) => {
    var data = req.body; //Todo user creation
    // async.waterfall([], (err, response)=>{


    //     if(err){
    //         return res.failure('Failure Msg')// todo Msg
    //     }
    //     return res.data(mapper.toModel(user));
    // })
    db.user.build({
        email: data.email,
        username: data.username,
        password: data.password,
        phone: data.phone,
        name: data.name,
        code: data.code,
        dob: data.dob,
        eduUserid: data.eduUserId,
        gender: data.gender
    }).save().then(user => {
        if (!user) {
            res.failure('failed to create user');
        }
        user.token = auth.getToken(user);
        user.save();
        return res.data(mapper.toModel(user));
    }).catch(err => {
        res.failure(err);
    });
};

exports.search = (req, res) => {
     (req.query.name) 
     

    db.user.findAll({
       
                where: {
                    $or: [
                        { name: { $like: '%' + req.query.name + '%' } },
                        { code: { $like: '%' + req.query.name + '%' } }
                    ]
                  
                }
            
                
        
    }).then(users => {
        if (!users) {
            res.failure('user not found');
        }
           
        return res.data(mapper.toSearchModel(users));
    }).catch(err => {
        res.failure(err);
    });
};