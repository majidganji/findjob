/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');

module.exports = {
    index: function(req, res){
        res.send(':)')
    },
	// signup: function (req, res, next) {
    //     return res.view({
    //         errors: req.flash('danger'),
    //         layout: 'layout-admin'
    //     });
    // },
    // create: function (req, res, next) {
    //     var obj = {
    //         name: req.param('name'),
    //         username: req.param('username'),
    //         email: req.param('email'),
    //         password: req.param('password')
    //     };
    //     Admin.create(obj, function (err, offer) {
    //         if(err){
    //             req.flash('danger', ErrorService.ParseUserErrors(err.Errors));
    //             return res.redirect('/admin/signup');
    //         }
    //         req.flash('success', 'با موفقیت ثبت شد.');
    //         return res.redirect('/admin/signin');
    //     });
    // },
    signin: function (req, res, next) {
        res.view({
            success: req.flash('success'),
            danger: req.flash('danger'),
            layout: 'layout-admin'
        });
    },
    login: function (req, res, next) {
        if(!req.param('username') || !req.param('password')){
            req.flash('danger', 'نام کاربری یا رمز عبور اجباری است');
            return res.redirect('/admin/signin')
        }
        Admin.findOneByUsername(req.param('username'), function (err, offer) {
            if (err, !offer){
                req.flash('danger', 'نام کاربری یا رمز عبور اشتباه است');
                return res.redirect('/admin/signin');
            }
            bcrypt.compare(req.param('password'), offer.password, function (err, valid) {
                if (err || !valid){
                    req.flash('danger', 'نام کاربری یا رمز عبور اشتباه است');
                    return res.redirect('/admin/signin');
                }
                if(offer.status === '0'){
                    req.flash('danger', 'حساب کاربری شما غیر فعال است.');
                    return res.redirect('/admin/signin');
                }
                req.session.authenticated = true;
                // Admin.update(offer.id, {online: true}, function(err){
                //     if(err){
                //          return next(err);
                //     }
                // });
                Log.create({username: offer.username}, function (err, log) {
                    if(err){
                        req.flash('danger', 'مشکل درهنگام ورود به سایت، دوباره تلاش کنید.');
                        return res.redirect('/dashboard/logout');
                    }
                    req.session.log = log.id;
                    req.session.admin = offer;
                    // req.session.admin.online = true;
                    if(req.session.backUrl){
                        return res.redirect(req.session.backUrl);
                    }
                    return res.redirect('/dashboard/index');
                })
            })
        });
    }
};

