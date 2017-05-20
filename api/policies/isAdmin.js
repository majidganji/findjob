module.exports = function (req, res, next) {
    if(!req.session.authenticated){
        req.session.backUrl = req.url;
        return res.redirect('/admin/signin');
    }
    Report.count({status: false},function (err, count) {
        res.locals.layout = 'layout-dashboard';
        res.locals.countReports = count;
        return next();
    })
};