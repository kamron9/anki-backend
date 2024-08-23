const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
	front: { type: String, required: true },
	back: { type: String, required: true },
	pronunciation: { type: String, required: false }, // Optional field
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Card', cardSchema)
