const apiService = require("./../data/apiService.js"),
      express = require("express"),
      rnd = require("./../helpers/utils.js").randomNumber,
      async = require("async"),
      router = express.Router();

router.get("/list", (req, res, next) => {

    let ListsData = [{ name: "Popular",              series: [], apiRequest: "tv/popular" },
                     { name: "Recommend by friends", series: [], apiRequest: null },
                     { name: "Today on TV",          series: [], apiRequest: "tv/airing_today" }];

    let everythingDone = (err) => {
        if (err) {
            next(err);
        }
        else {
            res.send(ListsData);
        }
    };

    let apiCallSeries = (listItem, cb) => {

        if (listItem.apiRequest !== null) {

            apiService.request(listItem.apiRequest, (err, data) => {
                
                switch (listItem.name) {
                    case "Popular":
                        let picked = [], lengte = data.results.length;
                        
                        for (let counter = 5; counter--;) {

                            let rndNumber =  rnd(lengte);

                            if (picked.indexOf(rndNumber) >= 0) {
                                counter++;
                            }
                            else {
                                picked.push(rndNumber);
                                listItem.series.push(data.results[rndNumber]);
                            }
                        }
                    default: 
                        // TODO: if (listname == "Today on TV") { // check gebruikers favorite series. }
                        listItem.series = data.results;
                }

                cb();
            });
        }
        else {
            // TODO: verder uit te werken
            cb();
        }
    };

    let genresData = (err, data) => {

        // TODO: Check favorite genre van gebruiker en voeg dit toe aan `ListsData`.
        async.each(ListsData, apiCallSeries, everythingDone);
    };

    apiService.request("genre/tv/list",  genresData);
});

module.exports = router;