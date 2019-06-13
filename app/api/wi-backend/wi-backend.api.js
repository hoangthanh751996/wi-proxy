const api = require("express").Router();
const wiBackendServices = require("../../services/wi-backend");

api.use("/wi-backend", async (req, res) => {
    const response = await wiBackendServices.wiBackendForward(req.url, req.method, req.headers, req.query, req.body);
    res.json(response);
});

module.exports = api;
