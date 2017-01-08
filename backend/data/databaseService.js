const config = require("./config.json"),
    mongoose = require('mongoose'),
    achievement = require("./../models/achievement"),
    users = require("./../models/user"),
    async = require('async'),
    followedSeries = require('./../models/followedSeries'),
    watchedEpisode = require('./../models/watchedEpisode'),
    userEvent = require('./../models/userEvent');

let existsWatchedEpisode = (body, cb) => {
        watchedEpisode
            .count({
                userId: body.userId,
                seriesId: body.seriesId,
                seasonId: body.seasonId,
                episodeId: body.episodeId
            })
            .exec(cb);
    },
    updateWatchedEpisode = (body, cb) => {
        existsWatchedEpisode(body, (err, count) => {
            if (count > 0) {
                watchedEpisode.update({
                        userId: body.userId,
                        seriesId: body.seriesId,
                        seasonId: body.seasonId,
                        episodeId: body.episodeId

                    }, {
                        "$set": {
                            watched: body.watched
                        }
                    }
                )
                    .exec(cb);
            } else {
                new watchedEpisode({
                    userId: body.userId,
                    seriesId: body.seriesId,
                    seasonId: body.seasonId,
                    episodeId: body.episodeId,
                    watched: body.watched
                }).save(cb);
            }
        });
    },
    existsFollowedSeries = (userId, seriesId, cb) => {
        followedSeries
            .count({
                user: userId,
                seriesId
            })
            .exec(cb);
    },
    updateFollowedSeries = (body, cb) => {
        existsFollowedSeries(body, (err, count) => {
            if (count > 0) {
                followedSeries.update({
                        userId: body.userId,
                        seriesId: body.seriesId

                    }, {
                        "$set": {
                            following: body.following
                        }
                    }
                )
                    .exec(cb);
            } else {
                new followedSeries({
                    userId: body.userId,
                    seriesId: body.seriesId,
                    following: body.following
                }).save(cb);
            }
        });
    },
    getAllFollowedSeriesByUserId = (userId, cb) => {
        followedSeries.find({
            user: userId,
            following: true
        }, {
            userId: 0,
            following: 0,
            __v: 0,
        }).exec(cb);
    },
    getWatchedEpisodesBySeriesSeasonId = (params, user, cb) => {
        watchedEpisode.find({
            userId: user._id,
            seriesId: params.series,
            seasonId: params.season
        }, {
            userId: 0,
            watched: 0,
            __v: 0,
        }).exec(cb);
    };

/*, updateFollowUser = (params, user, cb) =>{
 existsFollowedUser(body, (err, count) => {
 if (count > 0) {
 followedSerie.update({
 userId: body.userId,
 seriesId: body.seriesId

 }, {
 "$set": {
 following: body.following
 }
 }
 )
 .exec(cb);
 } else {
 new followedSerie({
 userId: body.userId,
 seriesId: body.seriesId,
 following: body.following
 }).save(cb);
 }
 });
 };*/

function addFollowedSeries(user, series, cb) {
    followedSeries.findOne({user, seriesId: series.id}, {following: 1, rating: 1})
        .exec((err, followed) => {
            if (err) return cb(err);
            cb(null, {
                series,
                following: followed ? followed.following : false,
                rating: followed ? followed.rating : -1
            });
        });
}

function addEvent(data, user, cb) {
    if (data.follow !== undefined) {
        //follow friend
        if (data.friendId !== undefined) {
            new userEvent({
                userId: user._id,
                userName: user.name,
                params: [{
                    follow: data.follow,
                    friendId: data.friendId,
                    friendName: data.friendName
                }]
            }).save(cb);
        }
        //follow series
        else if (data.seriesId !== undefined) {
            new userEvent({
                userId: user._id,
                userName: user.name,
                params: [{
                    follow: data.follow,
                    seriesId: data.seriesId
                }]
            }).save(cb);
        }
    }
    else if (data.watch !== undefined) {
        //watch episode
        if ((data.seriesId && data.seasonId && data.episodeId) !== undefined) {
            new userEvent({
                userId: user._id,
                userName: user.name,
                params: [{
                    watch: data.watch,
                    seriesId: data.seriesId,
                    seasonId: data.seasonId,
                    episodeId: data.episodeId
                }]
            }).save(cb);
        }
    }
    else if (data.rating !== undefined) {
        if (data.seriesId !== undefined) {
            //rate episode
            if ((data.seasonId && data.episodeId) !== undefined) {
                new userEvent({
                    userId: user._id,
                    userName: user.name,
                    params: [{
                        seriesId: data.seriesId,
                        seasonId: data.seasonId,
                        episodeId: data.episodeId,
                        rating: data.rating
                    }]
                }).save(cb);
            }
            //rate series
            else {
                new userEvent({
                    userId: user._id,
                    userName: user.name,
                    params: [{
                        seriesId: data.seriesId,
                        rating: data.rating
                    }]
                }).save(cb);
            }
        }
    } else {
        cb(new Error("The provided options didn't form a correct event!"))
    }
}

module.exports = {
    /* ACHIEVEMENTS */
    getAchievements: (cb) => achievement.find({}).exec(cb),

    /* FOLLOWEDSERIES */
    getFollowedSeries: (user, cb) =>
        followedSeries.find({user}, {_id: 0, user: 0}).exec(cb),

    updateFollowedSeries: (user, seriesId, data, cb) =>
        followedSeries.update({user, seriesId}, data, {upsert: true, setDefaultsOnInsert: true}).exec(cb),

    findFollowedSeries: (user, seriesId, cb) =>
        followedSeries.findOne({user, seriesId}, {_id: 0, user: 0, seriesId: 0}).exec(cb),

    addFollowedSeries,

    addFollowedSeriesList: (user, seriesList, cb) => {
        let results = [];
        async.each(seriesList, (item, cb) =>
            addFollowedSeries(user, item, (err, series) => {
                if (err) return cb(err);
                results.push(series);
                cb();
            }), err => {
            if (err) return cb(err);
            cb(null, results);
        });
    },


    /* WATCHEDEPISODE */
    findWatchedEpisode: existsWatchedEpisode,
    updateWatchedEpisode,
    getWatchedEpisodesBySeriesSeasonId,
    addEvent
};