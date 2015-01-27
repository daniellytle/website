module.exports = function (app) { // handling requests sent to kappathetapi.com/app

    app.use(function auth (req, res, next) {
        if (req.isAuthenticated()) return next(); // if user is authenticated in the session, carry on
        else return res.redirect('/app/login'); // if they aren't redirect them to the home page
    }) // ensure that all app requests are authenticated

    // kappathetapi.com/app/
    app.get('/', function (req, res) {
        return res.render('app',{member:req.user})
    })

    // kappathetapi.com/app/interest
    app.get('/interest', function (req, res) {
        return res.sendfile(require('path').resolve(__dirname+'/../data/interest.txt'))
    })

    // kappathetapi.com/app/applications
    app.use('/applications', require('serve-static')(require('path').resolve(__dirname+'/../../data/')))
    app.use('/applications', require('serve-index')(require('path').resolve(__dirname+'/../../data/')))

}