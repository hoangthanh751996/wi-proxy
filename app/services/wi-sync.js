const apiSender = require("../utils/api-sender");
const config = require("config");
const WI_SYNC_HOST = process.env.WI_SYNC_HOST || config.get("private_hosts.wi_sync");

const createExportDb = async (payload) => {
    let url = `${WI_SYNC_HOST}/export-db`;
    return apiSender.postThirdServer(url, {}, {}, payload);
};

module.exports = {
    createExportDb
};
