/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/


    '/': {
        controller: 'site',
        action: 'index'
    },
    '/about': {
        controller: 'site',
        action: 'about'
    },
    '/contact': {
        controller: 'site',
        action: 'contact'
    },
    '/new': {
        controller: 'site',
        action: 'new'
    },
    '/detail/:slug/:id':{
        controller: 'site',
        action: 'detail'
    },
    '/city/:slug':{
        controller: 'site',
        action: 'city'
    },
    '/category/:slug':{
        controller: 'site',
        action: 'category'
    },
    '/search':{
        controller: 'site',
        action: 'search'
    },
    '/newContact': 'SiteController.newContact',
    '/conditions': 'SiteController.conditions',
    '/report': 'SiteController.report',

    '/categories/:slug/active' : 'CategoriesController.active',
    '/categories/:id/view' : 'CategoriesController.view',
    '/categories/:id/delete' : 'CategoriesController.delete',
    '/categories/:id/edit' : 'CategoriesController.edit',
    '/categories/:id/update' : 'CategoriesController.update',

    '/reports/:id/status' : 'ReportsController.status',
    '/reports/:id/view' : 'ReportsController.view',
    '/reports/:id/delete' : 'ReportsController.delete',

    '/jobs/:id/active' : 'JobsController.active',
    '/jobs/:id/view' : 'JobsController.view',
    '/jobs/:id/delete' : 'JobsController.delete',
    '/jobs/:id/edit' : 'JobsController.edit',
    '/jobs/:id/update' : 'JobsController.update',

    '/cities/:id/active' : 'CitiesController.active',
    '/cities/:id/delete' : 'CitiesController.delete',
    '/cities/:id/edit' : 'CitiesController.edit',
    '/cities/:id/update' : 'CitiesController.update',
    '/cities/:id/delete' : 'CitiesController.delete',
    '/cities/new': 'CitiesController.new',
    '/cities/insert': 'CitiesController.insert',

    '/contacts/:id/delete' : 'ContactsController.delete',
    '/contacts/:id/view' : 'ContactsController.view',

    '/log/:id/delete' : 'LogController.delete',

    
    '/user/:id/edit' : 'UserController.edit',
    '/user/:id/update' : 'UserController.update',
    '/user/:id/delete' : 'UserController.delete',
    '/user/:id/view' : 'UserController.view',
    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};
