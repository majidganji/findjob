/**
 * City.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        slug: {
            type: 'string',
            required: true
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        city:{
            collection: 'job',
            via: 'city'
        }
    },
    validationMessages:{
        name: {
            required: 'نام اجباری است'
        }
    },
    afterDestroy: function (value, cb) {
        Job.destroy({city: _.pluck(value, 'id')}).exec(cb);
    }
};

