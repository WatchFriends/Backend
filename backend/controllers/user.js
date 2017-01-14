const dbService = require('../data/databaseService.js'),
    express = require('express'),
    router = express.Router(),
    each = require('async').each,
    seriesSerivice = require('../service/series');

const callback = (res, next) =>
    (err, data) => {
        if (err) {
            return next(err);
        }
        res.json(data);
    };

router.get('/user/search/:query', (req, res, next) => {
    dbService.searchUsers(req.param('query'), callback(res, next));
});

router.get('/user/:id/followers', (req, res, next) => {
    dbService.getFollowers(req.param('id'), callback(res, next));
});

router.get('/user/:id/follows', (req, res, next) => {
    dbService.getFollows(req.param('id'), callback(res, next));
});

router.get('/user/:follower/follows/:followed', (req, res, next) => {
    dbService.getFollower(req.param('followed'), req.param('follower'), callback(res, next));
});

router.put('/user/:follower/follows/:followed', (req, res, next) => {
    dbService.update(req.param('followed'), req.param('follower'), req.param('follows') ? Date.now() : null, callback(res, next));
});

router.get('/user/:id', (req, res, next) => {

    let user = {
        id: req.param('id'),
        friends: {
            followers: [],
            follows: []
        }
    };

    let functions = [
        cb => dbService.getUser(user.id, (err, data) => {
            if (err) return cb(err);

            user["email"] = data._doc.email;
            user["name"] = data._doc.name;
            cb();
        }),
        cb => {
            dbService.getFollows(user.id, (err, data) => {
                if (err) return cb(err);

                user.friends.follows = data;
                cb();
            });
        },
        cb => {
            dbService.getFollowers(user.id, (err, data) => {
                if (err) return cb(err);

                user.friends.followers = data;
                cb();
            });
        },
        cb => {

            user["achievements"] = [];
            cb();
        },
        cb => {

            seriesSerivice.watchlist(user.id, (err, data) => {
                if (err) cb(err);
                user["watchlist"] = data;
                cb();
            });
        }
    ];

    each(functions, (f, cb) => f(cb), err => {
        if (err) next(err);
        res.json(user);
    });

    // dbService.getUser(req.param('id'), () => {
    //     callback(res, next);
    // });
});

module.exports = router;