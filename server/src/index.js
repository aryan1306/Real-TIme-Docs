const mongoose = require("mongoose");
// const { findOrCreateDocument } = require("./utils/findOrCreateDocument");
const UserDocument = require("../models/userDocument");

mongoose.connect("mongodb://localhost/docsDB");

const io = require("socket.io")(4000, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});
const defaultValue = "";
io.on("connection", (socket) => {
	socket.on("get-document", async (documentId) => {
		const document = await findOrCreateDocument(documentId);
		socket.join(documentId);
		socket.emit("load-document", document.data);

		socket.on("send-changes", (delta) => {
			socket.broadcast.to(documentId).emit("receive-changes", delta);
		});

		socket.on("save-document", async (data) => {
			await UserDocument.findByIdAndUpdate(documentId, { data });
		});
	});
});
const findOrCreateDocument = async (id, defaultValue = "") => {
	if (id == null) return;
	const existingDocument = await UserDocument.findById(id);
	if (existingDocument) return existingDocument;
	const doc = await UserDocument.create({ _id: id, data: defaultValue });
	return doc;
};
