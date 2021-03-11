const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name: String,
	color: String,
})

module.exports = mongoose.model("User", schema)