/**
 * SiteController
 *
 * @description :: Server-side logic for managing sites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
moment.locale('fa');
const limtPage = 21;
module.exports = {
    index: function (req, res, next) {
        var where = {active: true};
        var pageId = req.param('pageId') || 1;
        if (req.cookies.selectedcity) {
            where['city'] = req.cookies.selectedcity.id;
        }
        Job.find({
            where: where,
            sort: 'updatedAt DESC'
        }).paginate({page: pageId, limit: limtPage}).populate('city').exec(function (err, jobs) {
            if (err) {
                return next(err);
            }
            Job.count(where, function (err, count) {
                if (req.xhr) {
                    return res.json(jobs);
                } else {
                    res.view({
                        jobs: jobs,
                        success: req.flash('success'),
                        moment: moment,
                        count: Math.ceil(count / limtPage)
                    });
                }
            })
        });
    },
    about: function (req, res) {
        res.view({
            title: 'درباره ما',
            data: fs.readFileSync(path.join(__dirname, '..', '..', 'views', 'setting', 'about.txt'))
        });
    },
    conditions: function (req, res) {
        res.view({
            title: 'شرایط',
            data: fs.readFileSync(path.join(__dirname, '..', '..', 'views', 'setting', 'conditions.txt'))
        });
    },
    contact: function (req, res) {
        res.view({
            title: 'تماس با ما',
            old: req.flash('old'),
            errors: req.flash('errors')
        });
    },
    new: function (req, res, next) {
        var old = req.flash('old');
        old = old.length === 1 ? old[0] : null;
        return res.view({
            layout: 'layout-new',
            errors: req.flash('danger'),
            old: old
        });
    },
    newjob: function (req, res, next) {
        var newobj = {
            ip: req.ip,
            title: req.param('title'),
            city: req.param('city'),
            phone: req.param('phone'),
            email: req.param('email'),
            category: req.param('category'),
            description: req.param('description'),
            active: true
        };
        if (!req.param('confirm')) {
            req.flash('old', newobj);
            req.flash('danger', ['شما قوانین را قبول ندارید.']);
            return res.redirect('/new');
        }
        Job.create(newobj, function (err, data) {
            if (err) {
                req.flash('danger', ErrorService.ParseUserErrors(err.Errors));
                req.flash('old', newobj);
                return res.redirect('/new');
            }
            req.flash('success', ['با موفقیت درج شد.']);
            return res.redirect('/');
        });
    },
    detail: function (req, res, next) {
        Job.findOne({
            slug: req.param('slug'),
            id: req.param('id'),
            active: true
        }).populate('city').populate('category').exec(function (err, data) {
            if (err) {
                return res.serverError(err);
            }
            if(!data){
                return res.notFound('');
            }
            return res.view({
                title: data.title,
                data: data,
                moment: moment,
                success: req.flash('success'),
                danger: req.flash('danger')
            });
        });
    },
    city: function (req, res, next) {
        City.findOne({slug: req.param('slug'), active: true}, function (err, city) {
            if (err) {
                return next(err);
            }
            res.cookie('selectedcity', {
                name: city.name,
                slug: city.slug,
                id: city.id
            }, {
                expires: new Date(Date.now() + 9000000)
            });
            return res.redirect('/');
        })
    },
    category: function (req, res, next) {
        Category.findOne({
            slug: req.param('slug'),
            active: true
        }, function (err, category) {
            if (err && !category) {
                return res.notFound('پیدا نشد');
            }
            if(!category){
                return res.redirect('/');
            }
            var where = {
                active: true,
                category: category.id
            };
            if (req.cookies.selectedcity) {
                where['city'] = req.cookies.selectedcity.id;
            }
            var pageId = req.param('pageId') || 1;
            Job.find({
                where: {
                    category: category.id,
                    active: true
                },
                sort: 'updatedAt DESC'
            }).paginate({page: pageId, limit: limtPage}).populate('city').exec(function (err, jobs) {
                Job.count(where, function (err, count) {
                    if(req.xhr){
                        return res.json(jobs);
                    }
                    return res.view({
                        jobs: jobs,
                        moment: moment,
                        success: req.flash('success'),
                        jcategory: category,
                        count: Math.ceil(count / limtPage)
                    })
                });
            });
        })
    },
    search: function (req, res, next) {
        var search = {
            active: true
        };
        if (req.param('title')) {
            search['title'] = {like: '%' + req.param('title') + '%'};
        }
        if (req.param('city')) {
            search['city'] = req.param('city');
        }
        if (req.param('category')) {
            search['category'] = req.param('category');
        }
        if (search.title || search.city || search.category) {
            Job.find({
                where: search,
                sort: 'updatedAt DESC'
            }).populate('city').exec(function (err, jobs) {
                return res.view({
                    title: 'جستجو',
                    jobs: jobs,
                    moment: moment,
                    old: {
                        title: req.param('title'),
                        city: req.param('city'),
                        category: req.param('category')
                    }
                });
            });
        } else {
            return res.view({
                title: 'جستجو',
                jobs: null,
                old: null
            });
        }
    },
    report: function (req, res, next) {
        var obj = {
            title: req.param('title'),
            description: req.param('description'),
            ip: req.ip,
            job: req.param('post')
        };
        console.log(obj);
        Report.create(obj).exec(function (err, offer) {
            if(err){
                req.flash('danger', 'عملیات با شکست مواجه شد.');
            }else{
                req.flash('success', 'عملیات با موفقیت انجام شد.');
            }
            return res.redirect(req.header('Referer') || '/');
        });
    },
    newContact: function (req, res, next) {
        const {name, email, subject, body} = req.allParams();
        const ip = req.ip;
        Contact.create({name: name, email: email, subject: subject, body: body, ip: ip}).exec(function (err, offer) {
            if(err){
                req.flash('errors', ErrorService.ParseUserErrors(err.Errors));
                req.flash('old',{name: name, email: email, subject: subject, body: body});
                return res.redirect('/contact');
            }
            req.flash('success', 'با موفقیت پیام شما ارسال شد.');
            res.redirect('/');
        });
    },
    removeCity: (req, res, next)=>{
        res.clearCookie('selectedcity');
        res.redirect(req.header('Referer') || '/');
    }
};

