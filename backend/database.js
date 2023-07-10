const {Client} = require('pg')

const client = new Client({
    host: process.env.DB_HOST,
    user: "postgres",
    port:5432,
    password:"postgres",
    database:"postgres"
})

module.exports = client;