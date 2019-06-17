const apiSender = require("../utils/api-sender");
const config = require("config");
const LOCAL_WI_BACKEND_HOST = process.env.LOCAL_WI_BACKEND_HOST || config.get("locals.wi_backend");

const wiBackendForward = async (route, method, headers, query,payload) => {
    let url = `${LOCAL_WI_BACKEND_HOST}${route}`;
    if (method === "POST") {
        let resPost = await apiSender.postThirdServer (url, headers, query, payload);
        return resPost;
    } else if (method === "GET") {
        let resGet = await apiSender.getThirdServer (url, headers, query, payload);
        return resGet;
    }
};

module.exports = {
    wiBackendForward
};
