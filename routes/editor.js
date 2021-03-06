var express = require('express');
var router = express.Router();
var approveDraftRoute = require('./editor/approve-draft');

router.use((req, res, next) => {
    var user;
    if (typeof req.session.passport !== 'undefined')
        user = req.session.passport.user;
    
    if (typeof user === 'undefined' || typeof user.roleID === 'undefined' || user.roleID !== 3)
        res.status(400).send('Bạn không có quyền truy cập vào trang này');
    else
        next();
});

router.use('/approve-draft', approveDraftRoute);

module.exports = router;