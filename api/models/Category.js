/**
 * Category.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            size: 100,
            unique: true
        },
        slug:{
            type: 'string'
        },
        description: {
            type: 'string'
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        category:{
            collection: 'job',
            via: 'category'
        }
    },
    validationMessages:{
        name:{
            required: 'نام دسته بندی اجباری است',
            size: 'طول نام نمی‌تواند بیشتر از 100 حرف باشد.',
            unique: 'نام مورد نظر قبلا درج شده'
        }
    },
    beforeCreate: function (values, cb) {
        var slug = values.name.replace(/ /g, '-');
        slug = slug.replace(/-{2,}/g, '-');
        values.slug = slug.replace(/-$/, '');
        cb();
    }
};

