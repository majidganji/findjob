/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
const momnet = require('moment');
momnet.locale('fa');
module.exports = {
	index: function(req, res, next){
        var page = req.param('page') || 1;
        Log.find({sort: 'id DESC'}).paginate({page: page, limit: LIMIT}).exec(function (err, models) {
            Log.count(function (err, count) {
                return res.view({
                    title: 'log',
                    models: models,
                    count: Math.ceil(count / LIMIT),
                    pageid: Number(page),
                    moment: momnet
                });
            });
        });
    },
    delete: function (req, res, next) {
        Log.destroy({id: req.param('id')}, function (err, ok) {
            if(err || !ok){
                req.flash('admin-danger', 'خطا دوباره تلاش کنید.');
            }else{
                req.flash('admin-success', 'با موفقیت حذف شد.');
                if(req.session.log === ok[0].id){
                    req.session.log = null;
                    return res.redirect('/dashboard/logout')
                }
            }
            res.redirect('/log');
        })
    },
    deleteAll: function (req, res, next) {
        Log.destroy({}, function (err, ok) {
            if(err){
                req.flash('admin-danger', 'خطا دوباره تلاش کنید.');
                res.redirect('/log');
            }else{
                req.flash('admin-success', 'با موفقیت حذف شد.');
                req.session.log = null;
                res.redirect('/dashboard/logout')
            }
        })
    }
};

