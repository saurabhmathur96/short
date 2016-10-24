const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));

module.exports = function (db) {
    passport.use(new LocalStrategy(function (username, password, done) {
            User.findOne(db.collection("users"), { username: username }).then((user) => {
                return Promise.all([user, user.comparePassword(password)]);
            }).then((args) => {
                let [user, passwordValid] = args;
                if (passwordValid) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }).catch((findErr) => {
                done(findErr, false);
            });
        }
    ));

    return passport;

}
