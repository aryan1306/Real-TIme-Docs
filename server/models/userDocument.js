const { Schema, model } = require("mongoose");

const UserDocument = new Schema({
	_id: String,
	data: Object,
});

module.exports = model("UserDocument", UserDocument);
