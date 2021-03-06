var session = require('express-session');

module.exports = function (app) {
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
    }));
};