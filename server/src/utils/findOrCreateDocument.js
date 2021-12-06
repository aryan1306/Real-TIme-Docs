const UserDocument = require("../../models/userDocument");

/**
 * @function findOrCreateDocument
 * @param {string} id
 * @param {string} defaultValue
 * @returns {Promise<any>}
 */
const findOrCreateDocument = async (id, defaultValue = "") => {
	if (id == null) return;
	const doc = await UserDocument.create({ _id: id, data: defaultValue });
	return doc;
};
module.exports = findOrCreateDocument;
