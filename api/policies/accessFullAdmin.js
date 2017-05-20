module.exports = function (req, res, next) {
    if(req.session.admin.status === '10'){
        return next();
    }
    req.flash('admin-danger', 'شما دسترسی ندارید.');
    res.redirect('/dashboard');
};