const mqtt = require('mqtt');
const config = require("config");
const client = mqtt.connect(process.env.MQTT_HOST || config.get("mqtt.host"), {rejectUnauthorized: false});
const queue = require("../../queue");

const subscribe = (topic) => {
    client.on('connect', function () {
        client.subscribe(topic)
    });
};

client.on('message', async function (topic, message) {
    const context = JSON.parse(message);
    console.log(context);
    await queue.create("import-db", context)
        .priority("high")
        .attempts(5)
        .save();
});

module.exports = {
    subscribe
};

