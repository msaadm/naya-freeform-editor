const mongoose = require("mongoose")

const schema = mongoose.Schema({
    lines: [],
    users: [],
})

module.exports = mongoose.model("Sketch", schema)