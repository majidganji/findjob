/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const bcrypt = require('bcrypt');
module.exports = {
    index: function (req, res) {
        res.view();
    },
    logout: function (req, res, next) {
        if(req.session.log){
            Log.update({id:  req.session.log}, {logout: new Date()}).exec(function (err, updated) {
                req.session.destroy();
                return res.redirect('/admin/signin');
            })
        }else{
            req.session.destroy();
            return res.redirect('/admin/signin');
        }
    },
    changePassword: function (req, res, next) {
        return res.view({
            title: 'تغییر رمز عبور',
            errors: req.flash('errors')
        })
    },
    newPassword: function (req, res, next) {
        var obj = {};
        var message = [];
        if(req.param('old-password')){
            obj['oldpassword'] = req.param('old-password');
        }else{
            message.push('رمز عبور قبلی نمی تواند خالی باشد.');
        }
        if(req.param('password')){
            obj['password'] = req.param('password');
        }else{
            message.push('رمز عبور جدید نمی تواند خالی باشد.');
        }
        if(req.param('repeat-password')){
            obj['repeatpassword'] = req.param('repeat-password');
        }else{
            message.push('تکرار رمز عبور جدید نمی تواند خالی باشد.');
        }
        if(message.length > 0){
            req.flash('errors', message);
            return res.redirect('/dashboard/changePassword');
        }
        if(obj.password !== obj.repeatpassword){
            req.flash('errors', 'تکرار رمز عبور جدید نادرست است.');
            return res.redirect('/dashboard/changePassword');
        }
        Admin.findOne(req.session.admin.id, function (err, user) {
            if(err || !user){
                req.flash('danger', 'خطا، لطفا دوباره تلاش کنید.');
                return res.redirect('/dashboard/logout');
            }
            bcrypt.compare(obj.oldpassword, user.password, function (err, offer) {
                if(err || !offer){
                    req.flash('errors', 'رمز عبور قبلی اشتباه است.');
                    return res.redirect('/dashboard/changePassword');
                }
                Admin.update({id: user.id},{password: bcrypt.hashSync(obj.password, 10)}).exec(function (err, updated) {
                    if(err){
                        req.flash('errors', ErrorService.ParseUserErrors(err.Errors));
                        return res.redirect('/dashboard/changePassword');
                    }
                    console.log(updated)
                    return res.redirect('/dashboard/logout');
                });
            });
        })
    },
    editProfile: function (req, res, next) {

        return res.view({
            title: 'ویرایش مشخصات',
            model: req.session.admin,
            errors: req.flash('errors')
        });
    },
    updateProfile: function (req, res, next) {
        console.log(req.allParams());
        const {username, name, email} = req.allParams();
        Admin.update({id: req.session.admin.id},{username: username, name: name, email: email}).exec(function (err, offer) {
           if(err){
               req.flash('errors',ErrorService.ParseUserErrors(err.Errors));
               return res.redirect('/dashboard/editProfile');
           }
           req.flash('success', 'عملیات با موفقیت انجام شد.');
            return res.redirect('/dashboard/logout');
        });
    }
};

