const shortid = require('shortid');
const bcrypt = require('bcryptjs');
const path = require('path');
const LocalStrategy   = require('passport-local').Strategy;
const passport = require('passport');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

function hashPassword(plaintextPassword) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintextPassword, salt);
}

function comparePassword(plaintextPassword, hashPassword) {
    return bcrypt.compareSync(plaintextPassword, hashPassword);
}

exports.signup = function signup(options, res) {
    var emails = db.get('users').map('email').value();
    var emailtaken = emails.includes(options.email);

    if (emailtaken) {
        return res.render(options.signUpTemplate, {errors: ['This email is already in use.']})
    } else {
        let thedate = new Date();

        db.get('users')
            .push({
                id: shortid.generate(),
                name: options.name,
                email: options.email,
                access_level: options.access_level,
                password: hashPassword(options.password),
                created_on: thedate,
                last_updated: thedate
            })
            .write();

        res.redirect(options.successRedirectUrl);
    }
};

exports.configurePassport = function(passport) {
    // Passport serializes and deserializes user instances to and from the session.

    // only the user ID is serialized and added to the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // for every request, the id is used to find the user, which will be restored
    // to req.user.
    passport.deserializeUser(function(id, done) {
        // find user in database
        var user = db.get('users').find({id: id}).value();

        if(!user) {
            done({ message: 'Invalid credentials.' }, null);
        } else {
            // the object is what will be available for 'request.user'
            done(null, {id: user.id, name: user.name, email: user.email});
        }
    });

    // LocalStrategy uses username / password in the database for authentication.
    passport.use(new LocalStrategy(
        function(email, password, done) {
            // look for user in database
            var email = db.get('users').find({ email: email }).value();

            // if user not found, return error
            if(!email) {
                return done(null, false, { message: 'Invalid email address.' });
            }

            // check if password matches
            var passwordsMatch = comparePassword(password, user.password);
            // if passowrd don't match, return error
            if(!passwordsMatch) {
                return done(null, false, { message: 'Invalid password.' });
            }

            //else, if username and password match, return the user
            return done(null, user);
        }
    ));
};