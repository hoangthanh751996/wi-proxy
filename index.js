const main = require("./app/main");

main()
    .catch(err => {
        console.log(err)
        process.exit(0)
    });