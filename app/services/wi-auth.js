const apiSender = require("../utils/api-sender");
const config = require("config");
const LOCAL_WI_AUTH_HOST = process.env.LOCAL_WI_AUTH_HOST || config.get("locals.wi_auth");
const CLOUD_WI_AUTH_HOST = process.env.CLOUD_WI_AUTH_HOST || config.get("clouds.wi_auth");

const loginForward = async (route, payload) => {
    let url = `${LOCAL_WI_AUTH_HOST}${route}`;
    let res = await apiSender.postThirdServer (url, {}, {}, payload);
    if (res && res.code !== 200) {
        url = `${CLOUD_WI_AUTH_HOST}${route}`;
        res = await apiSender.postThirdServer (url, {}, {}, payload);
        if (res && res.code === 200) {
            const content = res.content;
            url = `${LOCAL_WI_AUTH_HOST}/company/new`;
            res = await apiSender.postThirdServer(url, {Authorization: content.token}, {}, content.company);
            url = `${CLOUD_WI_AUTH_HOST}/user/list-by-company`;
            res = await apiSender.postThirdServer(url, {Authorization: content.token}, {}, {...payload});
            const usersCloud = res.content || [];
            const filterUser = usersCloud.filter(u => u.username === payload.username);
            if (filterUser[0]) {
                url = `${LOCAL_WI_AUTH_HOST}/user/new`;
                await apiSender.postThirdServer(url, {Authorization: content.token}, {}, {...filterUser[0], ...payload});
            }
            url = `${LOCAL_WI_AUTH_HOST}${route}`;
            res = await apiSender.postThirdServer (url, {Authorization: content.token}, {}, payload);
        }
    }
    return res;
};

const wiAuthForward = async (route, method, headers, query,payload) => {
    let url = `${LOCAL_WI_AUTH_HOST}${route}`;
    if (method === "POST") {
        let res = await apiSender.postThirdServer (url, headers, query, payload);
        // if (res && res.code !== 200) {
        //     url = `${CLOUD_WI_AUTH_HOST}${route}`;
        //     res = await apiSender.postThirdServer (url, token, payload);
        //     if (res && res.code === 200) {

        //     }
        // }
        console.log("res", res);
        return res;
    }
};

module.exports = {
    loginForward,
    wiAuthForward
}