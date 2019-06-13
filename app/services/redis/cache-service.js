const createClientRedis = require('./redis');
const config = require("config");
const host = process.env.REDIS_HOST || config.get("redis.host") || "127.0.0.1";
const port = process.env.REDIS_PORT || config.get("redis.port") || 6379;
const password = process.env.REDIS_PASSWORD || config.get("redis.password") || "";

const client = createClientRedis(`redis://${host}:${port}`);
client.auth(password);
const prefix = 'wi-proxy:';
const time_expire = 365* 24 * 60 * 60; // number * 60s

exports.set = (key, objectCache, expired = time_expire) => {
    console.log('set cache expired', expired);
    const object = JSON.stringify(objectCache);

    return client.setAsync(`${prefix}-${key}`, object, 'EX', expired)
        .then(result => {
            return Promise.resolve(objectCache);
        });
};

exports.get = (key) => {
    return client.getAsync(`${prefix}-${key}`)
        .then(result => {
            try {
                const object = JSON.parse(result);
                return Promise.resolve(object);

            } catch (error) {
                return Promise.resolve(result);
            }
        });
};

exports.delete = (key) => {
    console.log('xoa key', key);
    return client.delAsync(`${prefix}-${key}`)
        .then(result => {
            return Promise.resolve(key);
        });
};



