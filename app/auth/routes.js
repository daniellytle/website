module.exports = function (app,passport) {

    app.get('/signup', function(req, res) {
        if (req.user) res.redirect('/app');
        else res.render('signup', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/app',
        failureRedirect : '/app/signup',
        failureFlash : true 
    }));

    app.get('/login', function (req, res) {
        if (req.user) res.redirect('/app'); 
        else res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/app',
        failureRedirect : '/app/login',
        failureFlash : true 
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

}

function auth(req, res, next) { 
    if (req.isAuthenticated()) return next(); // if user is authenticated in the session, carry on
    else return res.redirect('/app/login'); // if they aren't redirect them to the home page
}