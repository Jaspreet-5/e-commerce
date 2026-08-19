// const dns = require("dns");

// dns.setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')

connectDB()
    .then(() => "Connection Resoloved")
    .catch(() => "Connection Refused")

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port ${process.env.PORT || 3000}`)
})

