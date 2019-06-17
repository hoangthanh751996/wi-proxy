const queue = require('../queue');
const config = require('config');
const CONCURRENT_TASKS_EXECUTE = config.get('CONCURRENT_TASKS_EXECUTE');
const {execShellCommand} = require("../utils/shell");
const PATH_DOWNLOAD = process.env.PATH_DOWNLOAD || config.get("path_download");
const MYSQL_HOST = process.env.MYSQL_HOST || config.get("mysql.host");
const MYSQL_PORT = process.env.MYSQL_PORT || config.get("mysql.port");
const MYSQL_USER = process.env.MYSQL_USER || config.get("mysql.user");
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || config.get("mysql.password");
const MYSQL_PREFIX = process.env.MYSQL_PREFIX || config.get("mysql.prefix");
const apiSender = require("../utils/api-sender");
const WI_SYNC_HOST = process.env.WI_SYNC_HOST || config.get("private_hosts.wi_sync");
const fs = require("fs");

queue.process("import-db", CONCURRENT_TASKS_EXECUTE, async (task, done) => {
    try {
        const {data} = task;
        console.log("process import db", data);
        const url = `${WI_SYNC_HOST}/download-db`;
        const res = await apiSender.postThirdServer(url, {}, {}, data);
        fs.writeFile(`${PATH_DOWNLOAD}/${MYSQL_PREFIX}${data.username}.sql`, res, async (err) => {
            if (err) throw new Error(err);
            await execShellCommand(`mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -h ${MYSQL_HOST} -P ${MYSQL_PORT} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_PREFIX}${data.username}"`, {cwd: PATH_DOWNLOAD});
            await execShellCommand(`mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -h ${MYSQL_HOST} -P ${MYSQL_PORT} ${MYSQL_PREFIX}${data.username} < ${MYSQL_PREFIX}${data.username}.sql`, {cwd: PATH_DOWNLOAD});
            await queue.create("download-curve", data)
                .priority("high")
                .attempts(5)
                .save();
        });
        console.log("Done Import");
    } catch (err) {
        done(err);
    }
});
