const config = require("config");
const queue = require("kue").createQueue({
    redis: {
        host: process.env.REDIS_HOST || config.get("redis.host") || "127.0.0.1",
        port: process.env.REDIS_PORT || config.get("redis.port") || 6379,
        auth: process.env.REDIS_PASSWORD || config.get("redis.password") || ""
    },
    disableSearch: false
});

module.exports = queue;
