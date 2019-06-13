const apiSender = require("../utils/api-sender");
const config = require("config");
const LOCAL_WI_BACKEND_HOST = process.env.LOCAL_WI_BACKEND_HOST || config.get("locals.wi_backend");
const CLOUD_WI_BACKEND_HOST = process.env.CLOUD_WI_BACKEND_HOST || config.get("clouds.wi_backend");

const wiBackendForward = async (route, method, headers, query,payload) => {
    let url = `${LOCAL_WI_BACKEND_HOST}${route}`;
    if (method === "POST") {
        let res = await apiSender.postThirdServer (url, headers, query, payload);
        if (res && res.code !== 200) {
            url = `${CLOUD_WI_BACKEND_HOST}${route}`;
            res = await apiSender.postThirdServer (url, headers, query, payload);
            if (res && res.code === 200) {
                // todo
                if (res.content) {
                    const content = res.content;

                }
            }
        }
        console.log("res", res);
        return res;
    } else if (method === "GET") {
        let res = await apiSender.getThirdServer (url, headers, query, payload);
        if (res && res.code !== 200) {
            url = `${CLOUD_WI_BACKEND_HOST}${route}`;
            res = await apiSender.getThirdServer (url, headers, query, payload);
            if (res && res.code === 200) {
                // todo
            }
        }
        console.log("res", res);
        return res;
    }
};

module.exports = {
    wiBackendForward
};
