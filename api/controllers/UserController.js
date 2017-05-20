/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
const moment = require('moment');
moment.locale('fa');
module.exports = {
    index: function (req, res, next) {
        var page = req.param('page') || 1;
        Admin.find().paginate({page: page, limit: LIMIT}).exec(function (err, models) {
            Admin.count(function (err, count) {
                return res.view({
                    title: 'مدیریت کاربران',
                    models: models,
                    count: Math.ceil(count / LIMIT),
                    pageid: Number(page)
                });
            });
        });
    },
    new: (req, res, next) => {
        return res.view({
            title: 'کاربر جدید',
            old: req.flash('old'),
            errors: req.flash('errors'),
        });
    },
    create: (req, res, next) => {
        var obj = {
            name: req.param('name'),
            username: req.param('username'),
            email: req.param('email'),
            password: req.param('password')
        };
        Admin.create(obj, function (err, offer) {
            if (err) {
                req.flash('errors', ErrorService.ParseUserErrors(err.Errors));
                req.flash('old', obj);
                return res.redirect('/user/new');
            }
            req.flash('success', 'با موفقیت ثبت شد.');
            return res.redirect('/user/' + offer.id + '/view');
        });
    },
    view: (req, res, next) => {
        Admin.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'کاربر مورد نظر پیدا نشد!');
                return res.redirect('/user');
            }
            return res.view({
                title: offer.name,
                model: offer,
                moment: moment,
            })
        })
    },
    delete: (req, res, next) => {
        Admin.destroy(req.param('id'), function (err, deleted) {
            if (err || !deleted) {
                req.flash('admin-danger', 'شهر پیدا نشد.');
                return res.redirect(req.header('Referer') || '/cities');
            }
            if(req.session.admin.id === deleted[0].id){
                req.flash('success', 'با موفقیت حذف شد.');
                return res.redirect('/dashboard/logout')
            }
            req.flash('admin-success', 'با موفقیت حذف شد.');
            res.redirect('/user');
        });
    },
    edit: (req, res, next) => {
        if(req.session.admin.id === req.param('id')){
            return res.redirect('/dashboard/editProfile');
        }
        Admin.findOne(req.param('id'), (err, model) =>{
            if(model.status === '10'){
                req.flash('admin-danger', 'کاربر مورد نظر مدیر کل است، دسترسی ندارید.');
                return res.redirect('/user');
            }
            res.view({
                title: 'ویرایش ' + model.name,
                model: model,
                errors: req.flash('errors')
            });
        });
    },
    update: (req, res, next) => {
        if(req.session.admin.id === req.param('id')){
            return res.redirect('/dashboard/editProfile');
        }
        Admin.findOne({id: req.param('id')}, function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'کاربر مورد نظر پیدا نشد.');
                return res.redirect('/user');
            }
            if(offer.status === '10'){
                req.flash('admin-danger', 'کاربر مورد نظر مدیر کل است، دسترسی ندارید.');
                return res.redirect('/user');
            }
            const {username, name, email, status} = req.allParams();
            Admin.update({
                id: offer.id
            }, {
                name: name,
                username: username,
                email:email,
                status: status
            }).exec(function (err, updated) {
                if (err) {
                    req.flash('errors', String(err))
                    // req.flash('errors', ErrorService.ParseUserErrors(err.Errors));
                    return res.redirect('/user/' + offer.id + '/edit');
                }
                req.flash('admin-success', 'تغییرات با موفقیت ذخیره شد.');
                return res.redirect('/user/' + offer.id + '/view');
            })
        });
    },
    search: (req, res, next) => {
        var obj = {};
        if (req.param('name')) {
            obj['name'] = {like: '%' +req.param('name') + '%'};
        }
        if (req.param('status')) {
            obj['status'] = req.param('status');
        }
        if (req.param('username')) {
            obj['username'] = {like: '%' +req.param('username') + '%'};
        }
        if (req.param('email')) {
            obj['email'] = {like: '%' +req.param('email') + '%'};
        }
        var page = req.param('page') || 1;
        if (Object.keys(obj).length > 0) {
            Admin.find(obj).paginate({page: page, limit: LIMIT}).exec(function (err, data) {
                if (err) {
                    req.flash('admin-danger', 'خطا، لطفا دوباره تلاش کنید.');
                    return res.redirect('/user');
                }
                if (!data || data.length < 1) {
                    return res.view({
                        title: 'جستجو',
                        message: 'موردی یافت نشد.',
                        old: req.allParams()
                    });
                }
                Admin.count(obj, function (err, count) {
                    return res.view({
                        models: data,
                        title: 'جستجو',
                        count: Math.ceil(count / LIMIT),
                        pageid: Number(page),
                        old: req.allParams()
                    });
                });
            });
        }else{
            return res.view({
                title: 'جستجو'
            })
        }
    }
};

