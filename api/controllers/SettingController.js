/**
 * SettingController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const fs = require('fs');
const path = require('path');
module.exports = {
    index: function (req, res, next) {
        res.view({
            title:'تنظیمات'
        })
    },
    about: function (req, res, next) {
        var pathFile = path.join(__dirname, '..', '..', 'views', 'setting', 'about.txt');
        if(req.param('body')){
            req.flash('admin-success', 'با موفقیت ذخیره شد.');
            fs.writeFileSync(pathFile, req.param('body'));
        }
        res.view({
            title: 'درباره ما',
            data: fs.readFileSync(pathFile)
        })
    },
    conditions: function (req, res, next) {
        var pathFile = path.join(__dirname, '..', '..', 'views', 'setting', 'conditions.txt');
        if(req.param('body')){
            req.flash('admin-success', 'با موفقیت ذخیره شد.');
            fs.writeFileSync(pathFile, req.param('body'));
        }
        res.view({
            title: 'شرایط',
            data: fs.readFileSync(pathFile)
        })
    }
};

