const http = require("http"),
      EventEmitter = require("events").EventEmitter,
      config = require("./config.json");

module.exports = (() => {
    
    let emitter = new EventEmitter();

    let optionsAPI = {
        method: "GET",
        port: "80",
        hostname: "api.themoviedb.org/3",
        apiKeys: config.api.keys
    };

    let call = (search, options, cb) => {
        if (search !== "") {
            optionsAPI = options ? options : optionsAPI;
            optionsAPI.path = "";
        }

        http.request(optionsAPI, response => {
            var json = "";

            response.on("data", chunk => json += chunk);

            response.on("end", () => {
                var jsonObject = JSON.parse(json.substring(1, json.length - 1).replace(/\\\'/g, ''));
                cb(null, jsonObject);
                emitter.emit("apiData", jsonObject.items);
            });

            response.on("error", err => {
                console.log(err.message);
                cb(err);
            });
        }).end();
    };

    return {
        on: emitter.on,
        once: emitter.once,
        call
    };
})();