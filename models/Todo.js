const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	isCompleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Todo', todoSchema)
