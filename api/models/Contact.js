/**
 * Content.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name:{
            type: 'string',
            required: true
        },
        email:{
            type: 'string',
            required: true,
            email: true
        },
        subject: {
            type: 'string',
            required: true
        },
        body: {
            type: 'string',
            required: true
        },
        ip: {
            type: 'string'
        }
    },
    validationMessages:{
        name:{
            required: 'نام و نام خانوادگی اجباری است.'
        },
        email:{
            required: 'پست الکترونیکی اجباری است.',
            email: 'پست الکترونیکی غیر معتبر است.'
        },
        subject: {
            required: 'موضوع اجباری است.'
        },
        body: {
            required: 'پیام اجباری است.'
        },
    },
};

