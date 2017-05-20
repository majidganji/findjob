/**
 * Job.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        ip:{
            type: 'string'
        },
        title: {
            type: 'string',
            required: true,
            size: 255
        },
        slug:{
            type: 'string'
        },
        phone: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            email: true,
            required: true
        },
        category: {
            model: 'category'
        },
        description: {
            type: 'string',
            required: true
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        city:{
            model: 'city'
        },
        report:{
            collection: 'report',
            via: 'job'
        }
    },
    validationMessages:{
        title: {
            required: 'عنوان اجباری است.',
            size: 'طول عنوان نمی تواند بیشتر از 255 حرف باشد.'
        },
        city:{
            required: 'شهر اجباری است'
        },
        phone:{
            required: 'تلفن اجباری است'
        },
        email:{
            required: 'پست الکترونیکی اجباری است',
            email: 'پست الکترونیکی نا معتبر است'
        },
        catrgory:{
            required: 'دسته بندی اجباری است'
        },
        description:{
            required: 'توضیحات اجباری است'
        }
    },
    beforeCreate: function (values, cb) {
        var slug = values.title.replace(/ /g, '-');
        slug = slug.replace(/-{2,}/g, '-');
        values.slug = slug.replace(/-$/, '');
        cb();
    },
    afterDestroy: function (value, cb) {
        Report.destroy({job: _.pluck(value, 'id')}).exec(cb);
    }
};

