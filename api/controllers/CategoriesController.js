/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const maxPage = 20;
module.exports = {
    index: function (req, res, next) {
        var pageId = req.param('page') || 1;
        Category.find()
            .paginate({page: pageId, limit: maxPage})
            .exec(function (err, data) {
                Category.count(function (err, count) {
                    return res.view({
                        category: data,
                        count: Math.ceil(count / maxPage),
                        pageid: Number(pageId),
                    });
                });
            });
    },
    active: function (req, res, next) {
        // res.send('test');
        Category.findOne({id: req.param('slug')}, function (err, offer) {
            if (err) {
                return res.redirect(req.header('Referer') || '/categories');
            }
            Category.update({id: offer.id}, {active: !offer.active}).exec(function (err, update) {
                if (err) {
                    console.error(err);
                }
                return res.redirect(req.header('Referer') || '/categories');
            });
        });
    },
    view: function (req, res, next) {
        Category.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'دسته‌بندی پیدا نشد!');
                return res.redirect('/categories');
            }
            return res.view({
                title: offer.name,
                category: offer,
            })
        })
    },
    delete: function (req, res, next) {
        Category.destroy(req.param('id'), function (err, deleted) {
            if (err) {
                req.flash('admin-danger', 'دسته بندی پیدا نشد.');
                return res.redirect(req.header('Referer') || '/category');
            }
            if (typeof deleted !== 'undefined' && deleted.length > 0) {
                deleted.forEach(function (p1, p2, p3) {
                    Job.destroy({category: p1.id})
                        .exec(function (err, offer) {
                            req.flash('admin-success', 'با موفقیت حذف شد.');
                            res.redirect('/categories');
                        });
                });
            }
        });
    },
    insert: function (req, res, next) {
        return res.view({
            title: 'درج دسته‌بندی',
            old: req.flash('old')
        });
    },
    new: function (req, res, next) {
        var obj = {
            name: req.param('name'),
            description: req.param('description'),
            active: !!req.param('active')
        };
        Category.create(obj, function (err, data) {
            if (err) {
                req.flash('admin-danger', ErrorService.ParseUserErrors(err.Errors));
                req.flash('old', obj);
                return res.redirect('/categories/insert');
            }
            req.flash('admin-success', 'باموفقیت درج شد.');
            res.redirect('/categories/' + data.id + '/view');
        })
    },
    edit: function (req, res, next) {
        Category.findOne(req.param('id'), function (err, category) {
            res.view({
                title: 'ویرایش ' + category.name,
                category: category
            });
        })
    },
    update: function (req, res, next) {
        Category.findOne(req.param('id'), function (err, offer) {
            if (err || !offer) {
                req.flash('admin-danger', 'دسته بندی مورد نظر پیدا نشد.');
                return res.redirect('/categories');
            }
            var obj = {
                name: req.param('name'),
                description: req.param('description'),
                active: !!req.param('active')
            };
            Category.update({id: offer.id}, obj).exec(function (err, updated) {
                if (err) {
                    req.flash('admin-danger', 'خطا، لطفا دوباره تلاش کنید.');
                    return res.redirect('/categories/' + offer.id + '/edit');
                }
                req.flash('admin-success', 'تغییرات با موفقیت ذخیره شد.');
                return res.redirect('/categories/' + offer.id + '/view');

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
            Category.find(obj).paginate({page: page, limit: maxPage}).exec(function (err, data) {
                if (err) {
                    return res.redirect('/categories');
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
                Category.count(obj, function (err, count) {
                    return res.view({
                        category: data,
                        title: 'جستجو',
                        count: Math.ceil(count / maxPage),
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

