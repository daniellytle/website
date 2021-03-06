var LocalStrategy = require('passport-local').Strategy;
var Account = require(__dirname+'/account.js');
var Member = require(__dirname+'/../model/member.js');

module.exports = function (passport) {

    // load and store account into / out of session
    passport.serializeUser(function(account, done) {
        done(null, account.id)
    })
    passport.deserializeUser(function(id, done) {
        Account.findById(id, function (err, account) {
            if(err) done(err,null)
            else if(account.type == 'member') Member.findById(account.ref, done)
            else done(null, account)
        })
    })

    // LOCAL SIGNUP 
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            Member.findOne({ 'email' : email }, function(err, member) {
                if (err) return done(err)
                if (member) {
                    return done(null, member)
                }
            })
        })
    }))

    // LOCAL LOGIN 
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 
        Account.findOne({ 'email' : email }, function(err, account) {
            if (err) return done(err)
            if (!account) return done(null, false, req.flash('loginMessage', 'No account found.')) // req.flash is the way to set flashdata using connect-flash
            account.validPassword(password, function(err, valid) {
                if (err) throw err
                if (!valid) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')) // create the loginMessage and save it to session as flashdata
                else return done(null, account) // all is well, return successful account 
            })
        })
    }))

}