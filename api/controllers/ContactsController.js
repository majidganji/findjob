/**
 * ContactControllerController
 *
 * @description :: Server-side logic for managing Contactcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
const moment = require('moment');
moment.locale('fa');
module.exports = {
	index: function (req, res, next) {
        var page = req.param('page') || 1;
        Contact.find({sort: 'id DESC'}).paginate({page: page, limit: LIMIT}).exec(function (err, models) {
            Contact.count(function (err, count) {
                return res.view({
                    title: 'مدیریت شهرها',
                    models: models,
                    count: Math.ceil(count / LIMIT),
                    pageid: Number(page),
                    title: 'مدیریت تماس باما',
                    moment: moment
                });
            });
        });
    },
    view: function (req, res, next) {
        Contact.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'دسته‌بندی پیدا نشد!');
                return res.redirect('/contacts');
            }
            return res.view({
                title: offer.name,
                contact: offer,
            })
        })
    },
    delete:function (req, res, next) {
        Contact.destroy(req.param('id'), function (err, deleted) {
            if (err) {
                req.flash('admin-danger', 'پیام مورد نظر پیدا نشد.');
                return res.redirect(req.header('Referer') || '/contacts');
            }
            req.flash('admin-success', 'با موفقیت حذف شد.');
            res.redirect('/contacts');
        });
    }
};

