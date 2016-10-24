const express = require("express");
const logger = require("morgan");
const mongo = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
const users = require(path.join(__dirname, "routes", "users"));
const urls = require(path.join(__dirname, "routes", "urls"));
const jwt = require("express-jwt");
const passport = require(path.join(__dirname, "authentication", "passport-jwt"));
//
// Create App.

let app = express();


//
// Configure middleware.

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//
// Configure authentication
app.use(jwt({ secret: process.env.SECRET || "secret" })
.unless({ path: ["/users/", "/users/login"] }));

const mongoUri = process.env.MONGO_URI || "mongodb://localhost/short";
mongo.connect(mongoUri, (err, db) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.log (err);
        // eslint-disable-next-line no-console
        console.log(`Unable to connect to db at:  ${mongoUri}`);
    } else {
        app.use(passport(db).initialize({ sessions: false }));
        app.use((req, res, next) => {
            req.db = db;
            next();
        })

        //
        // Configure routes.
        app.use("/users", users);
        app.use("/urls", urls);

    }


    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error("Not Found");
        err.status = 404;
        return next(err);
    });



    //
    // Configure error handlers.

    if (app.get("env") === "development") {

        // development error handler
        // eslint-disable-next-line no-unused-vars
        app.use((err, req, res, next) => {
            if (err.name === "UnauthorizedError") {
                res.status(401);
            } else {
                res.status(err.status || 500);
            }
            res.json({
                error: err,
                message: err.message,
                success: false
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        if (err.name === "UnauthorizedError") {
            res.status(401);
        } else {
            res.status(err.status || 500);
        }
        res.json({
            error: {},
            message: err.message,
            success: false
        });
    });

    //
    // Run the App.

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Magic on port ${port}! `);
    });

});