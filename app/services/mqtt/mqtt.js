const mqtt = require('mqtt');
const config = require("config");
const client = mqtt.connect(process.env.MQTT_HOST || config.get("mqtt.host"), {rejectUnauthorized: false});
const queue = require("../../queue");
const userActions = require("../../actions/user");

const subscribe = (topic) => {
    client.on('connect', function () {
        client.subscribe(topic)
    });
};

client.on('message', async function (topic, message) {
    const context = JSON.parse(message);
    console.log(context);
    const user = await userActions.findOne({username: context.username});
    if (user && user.is_import === false) {
        await queue.create("import-db", context)
            .priority("high")
            .attempts(5)
            .save();
        await userActions.update(user._id,{is_import: true});
    }
});

module.exports = {
    subscribe
};

