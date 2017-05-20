/**
 * CitiesController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
module.exports = {
    index: function (req, res, next) {
        var page = req.param('page') || 1;
        City.find().paginate({page: page, limit: LIMIT}).exec(function (err, models) {
            City.count(function (err, count) {
                return res.view({
                    title: 'مدیریت شهرها',
                    models: models,
                    count: Math.ceil(count / LIMIT),
                    pageid: Number(page)
                });
            });
        });
    },
    active: function (req, res, next) {
        City.findOne({id: req.param('id')}, function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'شهر مورد نظر پیدا نشد.');
                return res.redirect(req.header('Referer') || '/categories');
            }
            City.update({id: offer.id}, {active: !offer.active}).exec(function (err, update) {
                if (err) {
                    req.flash('admin-danger', 'خطا لطفا دوباره تلاش کنید.');
                }
                return res.redirect(req.header('Referer') || '/categories');
            });
        });
    },
    delete: function (req, res, next) {
        City.destroy(req.param('id'), function (err, deleted) {
            if (err || !deleted) {
                req.flash('admin-danger', 'شهر پیدا نشد.');
                return res.redirect(req.header('Referer') || '/cities');
            }
            req.flash('admin-success', 'با موفقیت حذف شد.');
            res.redirect('/cities');
        });
    },
    edit: function (req, res, next) {
        City.findOne(req.param('id'), function (err, city) {
            res.view({
                title: 'ویرایش ' + city.name,
                city: city,
                errors: req.flash('errors')
            });
        })
    },
    update: function (req, res, next) {
        City.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'شهر مورد نظر پیدا نشد.');
                return res.redirect('/cities');
            }
            var obj = {
                name: req.param('name'),
                active: !!req.param('active')
            };
            City.update({id: offer.id}, obj).exec(function (err, updated) {
                if (err) {
                    req.flash('errors', ErrorService.ParseUserErrors(err.Errors));
                    return res.redirect('/cities/' + offer.id + '/edit');
                }
                req.flash('admin-success', 'تغییرات با موفقیت ذخیره شد.');
                return res.redirect('/cities');

            })
        });
    },
    search: function (req, res, next) {
        var obj = {};
        if (req.param('name')) {
            obj['name'] = {like: '%' +req.param('name') + '%'};
        }
        if (req.param('active') === '0' || req.param('active') === '1') {
            obj['active'] = req.param('active') === '1';
        }
        var page = req.param('page') || 1;
        if (obj.name || (obj.active  || obj.active === false)) {
            City.find(obj).paginate({page: page, limit: LIMIT}).exec(function (err, data) {
                if (err) {
                    req.flash('admin-danger', 'خطا، لطفا دوباره تلاش کنید.');
                    return res.redirect('/cities');
                }
                if (!data || data.length < 1) {
                    return res.view({
                        title: 'جستجو',
                        message: 'موردی یافت نشد.',
                        old: {
                            name: req.param('name'),
                            active: req.param('active')
                        }
                    });
                }
                City.count(obj, function (err, count) {
                    return res.view({
                        city: data,
                        title: 'جستجو',
                        count: Math.ceil(count / LIMIT),
                        pageid: Number(page),
                        old: {
                            name: req.param('name'),
                            active: req.param('active')
                        }
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

