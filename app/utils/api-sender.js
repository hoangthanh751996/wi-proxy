const rp = require("request-promise");

function getThirdServer (url, headers, query) {
    let options = {
        uri: url,
        qs: {
            ...query
        },
        headers: {
            // ...headers,
            Authorization: headers["authorization"]
        },
        method: "GET",
        json: true
    };
    return rp(options);
}

function postThirdServer (url, headers, query, payload) {
    let options = {
        uri: url,
        qs: { // query params
            ...query
        },
        headers: {
            Authorization: headers["authorization"]
            // host: "localhost:3000"
        },
        method: "POST",
        body: payload,
        json: true
    };
    return rp(options)
        .catch(err => {
            console.log("Error postThirdServer", err);
            throw new Error(err);
        });
}

module.exports = {
    postThirdServer,
    getThirdServer
};
