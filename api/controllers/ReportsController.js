/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reportscontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
module.exports = {
    index: function (req, res, next) {
        var page = req.param('page') || 1;
        var query = Report.find();
        // query.sort('status asc');
        // query.sort('createdAt DESC');
        query.paginate({page: page, limit: LIMIT});
        query.populate('job');
        query.exec(function (err, offer) {
            console.log(offer);
            Report.count(function (err, count) {
                res.view({
                    title: 'گزارش شده',
                    models: offer,
                    pageId: Number(page),
                    count: Math.ceil(count / LIMIT),
                    success: req.flash('admin-success'),
                    danger: req.flash('admin-danger')
                })
            });
        });

    },
    status: function (req, res, next) {
        Report.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'گزارش مورد نظر یافت نشد.');
                return res.redirect('/reports');
            }
            Report.update({id: offer.id}, {status: !offer.status}, function (err, updated) {
                if (err || !updated) {
                    req.flash('admin-danger', 'عملیات با شکست مواجه شد.');
                }
                return res.redirect(req.header('Referer') || '/reports');
            })
        });
    },
    view:function(req, res, next){
        Report.findOne(req.param('id')).populate('job').exec(function (err, model) {
            if(err || !model){
                req.flash('admin-danger', 'گزارش مورد نظر پیدا نشد.');
                return res.redirect('/reports');
            }
            res.view({
                title: 'نمایش ' + model.title,
                model: model,
                success: req.flash('admin-success'),
                danger: req.flash('admin-danger')
            })
        });
    },
    delete: function (req, res, next) {
        Report.destroy(req.param('id'), function (err, deleted) {
            if(err){
                req.flash('admin-danger', 'گزارش مورد نر پیدا نشد.');
            }else{
                req.flash('admin-success', 'با موفقیت حذف شد.')
            }
            res.redirect('/reports');
            
        })
    }
};
