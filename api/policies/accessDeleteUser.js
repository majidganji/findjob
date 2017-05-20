module.exports = function (req, res, next) {

    Admin.findOne(req.param('id'), (err, model) => {
        if(model.id === req.session.admin.id){
            return next();
        }
        if(model.status !== '10'){
            return next();
        }
        req.flash('admin-danger', 'شما دسترسی ندارید.');
        res.redirect('/dashboard');
    })
};