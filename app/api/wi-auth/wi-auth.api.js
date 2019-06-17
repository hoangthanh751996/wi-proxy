const api = require("express").Router();
const wiAuthServices = require("../../services/wi-auth");
const ErrorCodes = require('../../const/error-codes').CODES;
const ResponseJSON = require('../../utils/response');
const userActions = require("../../actions/user");
const wiSyncService = require("../../services/wi-sync");
const mqttService = require("../../services/mqtt/mqtt");

api.post("/wi-auth/login", async (req, res) => {
    try {
        const subRoute = `/${req.url.split("/")[2]}` || "";
        const response = await wiAuthServices.loginForward(subRoute, req.body);
        if (response.code === 200) {
            const checkUser = await userActions.findOne({username: req.body.username});
            if (checkUser) {
                if (checkUser.is_syncing === false) {
                    res.json(response);
                } else {
                    res.json(ResponseJSON(ErrorCodes.SYNCING_DATA, "Syncing data"));
                }
            } else {
                const data = {
                    ...req.body,
                    is_syncing: true,
                    is_import: false,
                    topic: "export-db"
                };
                await userActions.create(data);
                // subscribe to mqtt
                mqttService.subscribe("export-db");
                // create job wi-sync
                await wiSyncService.createExportDb(data);
                res.json(ResponseJSON(ErrorCodes.SYNCING_DATA, "Starting Sync data"));
            }
        } else {
            return res.json(response);
        }
    } catch (err) {
        res.json(ResponseJSON(ErrorCodes.INTERNAL_SERVER_ERROR, err.message));
    }
});

api.use("/wi-auth", async (req, res) => {
    const response = await wiAuthServices.wiAuthForward(req.url, req.method, req.headers, req.query, req.body);
    return res.json(response);
});

module.exports = api;
