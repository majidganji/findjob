/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        password:{
            type: 'string',
            required: true
        },
        status: {
            type: 'string',
            enum:['0', '9', '10'],
            defaultsTo: '9'
        },
        online: {
            type: 'boolean',
            defaultsTo: false
        }
    },
    validationMessages:{
        username:{
            required: 'نام کاربری اجباری است',
            unique: 'نام کاربری قبلا رزرو شده است'
        },
        name: {
            required: 'نام اجباری است'
        },
        email:{
            email: 'پست‌الکترونیکی نامعتبر است',
            required: 'پست‌الکترونیکی اجباری است',
            unique: 'پست‌الکترونیکی قبلا رزرو شده است'
        },
        password: {
            required: 'رمز عبور اجباری است'
        },
        status:{
            enum: 'مقدار نامعتبر است'
        }
    },
    beforeCreate: function(values, next){
        require('bcrypt').hash(values.password, 10, function passwordEncrypt(err, encryptPassword){
            if(err) return next(err);
            values.password = encryptPassword;
            next();
        });
    }
};

