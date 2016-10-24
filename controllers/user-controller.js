const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Url = require(path.join(__dirname, "..", "models", "url"));

class UserController {
    static list (req, res, next) {
        let collection = req.db.collection("users");
        User.find(collection, {}).then((users) => res.json({
            success: true,
            users: users.map((user) => user.username)
        })).catch(next);
    }

    static findOne (req, res, next) {
        let collection = req.db.collection("users");
        let query = { username: req.params.username };
        User.findOne(collection, query).then((user) => res.json({
            success: true,
            user: user
        })).catch(next);
    }

    static create(req, res, next) {
        let collection = req.db.collection("users");
        let user = new User({ username: req.body.username, password: req.body.password });
        user.create(collection).then((savedUser) => res.json({
            success: true,
            user: savedUser.username
        })).catch(next);
    }

    static listUrls(req, res, next) {
        let collection = req.db.collection("urls");
        let query = { user: req.user.username };
        Url.find(collection, query).then((urls) => res.json({
            success: true,
            urls: urls.map((url) => url._id)
        })).catch(next);
    }

    static login(req, res, next) {
        passport.authenticate("local", (err, user) => {
            if (err) {
                next(err);
            } else if (!user) {
                var userNotFoundErr = new Error("User not found1.");
                userNotFoundErr.status = 401;
                next(userNotFoundErr);
            } else {
                let token = jwt.sign({
                    username: user.username
                }, process.env.SECRET || "secret", {
                        expiresIn: 31536000
                });

                res.json({
                    success: true,
                    token: token
                })
            }
        })(req, res, next);
    }
}

module.exports = UserController