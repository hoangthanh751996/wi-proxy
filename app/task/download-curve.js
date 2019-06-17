const queue = require('../queue');
const config = require('config');
const CONCURRENT_TASKS_EXECUTE = config.get('CONCURRENT_TASKS_EXECUTE');
const CURVE_BASE_PATH = process.env.CURVE_BASE_PATH || config.get("curveBasePath");
const apiSender = require("../utils/api-sender");
const WI_AUTH = process.env.WI_AUTH || config.get("clouds.wi_auth");
const WI_BACKEND = process.env.WI_AUTH || config.get("clouds.wi_backend");
const fs = require("fs");
const userActions = require("../actions/user");
const hashDir = require("../utils/data-tool").hashDir;

queue.process("download-curve", CONCURRENT_TASKS_EXECUTE, async (task, done) => {
    try {
        const {data} = task;
        console.log("process download curve", data);
        let url = `${WI_AUTH}/login`;
        let res = await apiSender.postThirdServer(url, {}, {}, data);
        if (res && res.code === 200) {
            const content = res.content;
            url = `${WI_BACKEND}/project/list`;
            res = await apiSender.postThirdServer(url, {"Authorization": content.token}, {}, {});
            const projects = res.content;
            for (let project of projects) {
                console.log("projects ======", project.name);
                url = `${WI_BACKEND}/project/fullinfo`;
                let payload = {
                    idProject: project.idProject,
                    name: project.name
                };
                res = await apiSender.postThirdServer(url, {"Authorization": content.token}, {}, payload);
                const projectFullInfo = res.content;
                const wells = projectFullInfo.wells;
                for (const well of wells) {
                    console.log("well ==== ", well.name);
                    const datasets = well.datasets;
                    for (const dataset of datasets) {
                        const curves = dataset.curves;
                        for (const curve of curves) {
                            console.log("downloading curve ==== ", curve.name);
                            url = `${WI_BACKEND}/project/well/dataset/curve/getDataFile`;
                            const dataFile = await apiSender.postThirdServer(url, {"Authorization": content.token}, {}, {idCurve: curve.idCurve});
                            const pathHash = hashDir.createPath(CURVE_BASE_PATH, data.username + project.name + well.name + dataset.name + curve.name, curve.name + '.txt');
                            fs.writeFile(pathHash, dataFile, async (err) => {
                                if (err) throw new Error(err);
                            })
                        }
                    }
                }
            }
            console.log("Done Download All");
            const user = await userActions.findOne({username: data.username});
            if (user) {
                await userActions.update(user._id, {is_syncing: false, is_import: true});
            }
            done();
        }
    } catch (err) {
        done(err);
    }
});
