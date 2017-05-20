/**
 * JobsController
 *
 * @description :: Server-side logic for managing Jobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const LIMIT = 20;
const moment = require('moment');
moment.locale('fa');
module.exports = {
	index:function(req, res, next){
		var page = req.param('page') || 1;
		Job.find({sort: 'createdAt DESC'})
			.populate('city')
			.populate('category')
			.paginate({page: page, limit: LIMIT})
			.exec(function (err, offer) {
				if(err){
					console.log(err);
					return next();
				}
				Job.count(function(err, count){
					if(err){
						console.log(err);
						return next(err);
					}
					return res.view({
						title: 'آگهی ها',
						models: offer,
						pageid: page,
						count: Math.ceil(count / LIMIT),
						success: req.flash('admin-success'),
						danger: req.flash('admin-danger'),
						pageId: Number(page)
					});
				});
            });
	},
	active: function (req, res, next) {
		Job.findOne(req.param('id'), function (err, model) {
			if(err){
				console.log(err);
				return next(err);
			}
			Job.update(model.id, {active: !model.active}, function (err, updated) {
				if(err){
					req.flash('admin-danger', 'خطا، لطفا دوباره تلاش کنید.');
				}
				return res.redirect(req.header('Referer') || '/jobs');
            })
        })
    },
	view: function (req, res, next) {
		Job.findOne(req.param('id'))
			.populate('city')
			.populate('category')
			.populate('report')
			.exec(function (err, model) {
				if(err || !model){
					req.flash('admin-danger', 'آگهی مورد نظر پیدا نشد.');
					return res.redirect('/jobs');
				}
				return res.view({
					title: model.title,
					model: model,
					moment:moment
				});
            })
    },
	edit: function (req, res, next) {
		Job.findOne(req.param('id'), function (err, model) {
			City.find(function (err, city) {
				Category.find(function (err, category) {
                    res.view({
                        title: 'ویرایش ' + model.title,
                        model: model,
                        errors: req.flash('errors'),
						city: city,
						category: category
                    })
                })
            })
        });
    },
	update: function (req, res, next) {
        var newobj = {
            title: req.param('title'),
            city: req.param('city'),
            phone: req.param('phone'),
            email: req.param('email'),
            category: req.param('category'),
            description: req.param('description'),
            active: req.param('active') === 'on'
        };
        Job.update({id: req.param('id')}, newobj, function (err, ok) {
            if (err) {
                req.flash('admin-danger', ErrorService.ParseUserErrors(err.Errors));
                return res.redirect('/jobs/' + req.param('id') + '/edit');
            }
            if(!ok){
                req.flash('admin-danger', 'خطا، لطفا دوباره تلاش کنید.');
                return res.redirect('/jobs/' + req.param('id') + '/edit');
			}
			req.flash('admin-success', 'با موفقیت ذخیره شد.');
            return res.redirect('/jobs/' + req.param('id') + '/view');
        })
    },
	delete: function (req, res, next) {
		Job.destroy(req.param('id'), function (err, job) {
			if(err){
				req.flash('admin-danger', 'خطا، دوباره تلاش کنید.');
				return res.redirect(req.header('Referer') || '/jobs');
			}
			req.flash('admin-success', 'با موفقیت حذف شد.');
			return res.redirect('/jobs');
        })
    },
	search: function (req, res, next) {
		var where = {};
		if(req.param('ip')){
			where['ip'] = {like: '%' +  req.param('ip') + '%'};
		}
		if(req.param('title')){
			where['title'] = {like: '%' +  req.param('title') + '%'};
		}
        if(req.param('email')){
            where['email'] = {like: '%' +  req.param('email') + '%'};
        }
        if(req.param('phone')){
            where['phone'] = {like: '%' +  req.param('phone') + '%'};
        }
        if(req.param('active')){
            where['active'] = req.param('active') === '1';
        }
        if(req.param('city')){
            where['city'] = req.param('city');
        }
        if(req.param('category')){
            where['category'] = req.param('category');
        }
        if(Object.keys(where).length > 0){
        	var page = req.param('page') || 1;
			Job.find(where)
				.paginate({page: page, limit: LIMIT})
				.populate('city')
				.populate('category')
				.exec(function (err, models) {
                    Job.count(function (err, count) {
                        res.view({
                            title: 'جستجو',
                            models: models,
                            count: Math.ceil(count / LIMIT),
                            pageId: Number(page),
							old: {
                            	ip : req.param('ip'),
                            	title : req.param('title'),
                            	phone : req.param('phone'),
                            	city : req.param('city'),
                            	category : req.param('category'),
                            	email : req.param('email'),
							}
                        });
                    });
                });
		}else{
			res.view({
				title: 'جستجو'
			})
		}
    }
};
