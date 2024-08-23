const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fullName: { type: String },
	isVerified: { type: Boolean, default: false },
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	refreshToken: String, // New field for storing the refresh token
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

userSchema.methods.matchPassword = function (password) {
	return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
