module.exports = function (req, res, next) {
    Category.find({active: true}, function (errcategory, category) {
        if(errcategory){
            return res.forbidden('You are not permitted to perform this action.');
        }
        City.find({active: true}, function (errcity, city) {
            if(errcity){
                return res.forbidden('You are not permitted to perform this action.');
            }
            res.locals.category = category;
            res.locals.city = city;
            return next();
        });
    });
};