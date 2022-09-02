const {Pool} = require("pg")

const options = {
    user:"<USERNAME>" ,
    password: "<PASSWORD>",
    host: "HOST",
    port: "PORT",
    database: "DATABASE",
}

const pool = new Pool(options)

module.exports = pool