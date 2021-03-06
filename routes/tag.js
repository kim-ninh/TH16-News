var express = require('express');
var route = express.Router();
var article = require('../models/articles');
var tagModel = require('../models/tags');
var paginator = require('../utils/paginator');
var userRoleModel = require('../models/user_role');

const articlePerPage = 5;       // define favorite number here.

route.get('/:name', (req, res, next) => {
    var userEntity = req.user;
    var isSubscriber = false;
    var tagName = req.params.name;
    tagName = tagName.replace(/-/g, ' ');

    var current;
    if (req.query.page === undefined) {
        current = 1;            // default page is page number 1
    }
    else {
        current = parseInt(req.query.page);
        if (current === undefined)
            next(new Error('404 not found'));
    }

    var page;

    userRoleModel.getId('Độc giả')
        .then(roleID => {
            if (userEntity !== undefined && userEntity.roleID === roleID) {
                isSubscriber = true;
            }
            return article.countTotalByTag_public(tagName);
        })
        .then(totalArticle => {
            page = paginator.get(current, totalArticle, articlePerPage);

            return Promise.all([tagModel.loadByName(tagName),
                article.loadByTagName(tagName, articlePerPage,
                    (current - 1) * articlePerPage, isSubscriber)]);
        })
        .then(([tagEntity, articles]) => {
            var obj = {
                articles: articles,
                tag: tagEntity,
                page: page
            };
            res.render('tag', obj);
        })
        .catch(next);
});

module.exports = route;