const User = require('../models/User')
const VerificationCode = require('../models/VerificationCode')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Registration logic
exports.registerUser = async (req, res) => {
	const { email, password, fullName } = req.body
	try {
		const user = await User.create({ email, password, fullName })
		const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 min expiration

		await VerificationCode.create({
			userId: user._id,
			code: verificationCode,
			expiresAt,
		})

		await sendEmail(
			user.email,
			'Email Verification',
			`Your verification code is: ${verificationCode}`
		)
		res
			.status(201)
			.json({ message: 'User registered, please verify your email.' })
	} catch (error) {
		res.status(500).json({ message: 'Registration failed', error })
	}
}

// Login logic
exports.loginUser = async (req, res) => {
	const { email, password } = req.body
	try {
		const user = await User.findOne({ email })
		if (!user || !(await user.matchPassword(password))) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}
		if (!user.isVerified) {
			return res.status(403).json({ message: 'Please verify your email first' })
		}
		const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
			expiresIn: '1h',
		})
		res.json({ token })
	} catch (error) {
		res.status(500).json({ message: 'Login failed', error })
	}
}

// Verify email
exports.verifyEmail = async (req, res) => {
	const { userId, code } = req.body
	try {
		const verificationCode = await VerificationCode.findOne({
			userId,
			code,
			expiresAt: { $gte: new Date() },
		})
		if (!verificationCode) {
			return res
				.status(400)
				.json({ message: 'Invalid or expired verification code' })
		}
		await User.findByIdAndUpdate(userId, { isVerified: true })
		await VerificationCode.findByIdAndDelete(verificationCode._id)
		res.json({ message: 'Email verified successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Email verification failed', error })
	}
}

// Forgot password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body
	try {
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ message: 'User not found' })

		const token = crypto.randomBytes(20).toString('hex')
		user.resetPasswordToken = token
		user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
		await user.save()

		await sendEmail(
			user.email,
			'Password Reset',
			`Your password reset token is: ${token}`
		)
		res.json({ message: 'Password reset email sent' })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to send password reset email', error })
	}
}

// Reset password
exports.resetPassword = async (req, res) => {
	const { token, password } = req.body
	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		})
		if (!user)
			return res.status(400).json({ message: 'Invalid or expired token' })

		user.password = password
		user.resetPasswordToken = undefined
		user.resetPasswordExpires = undefined
		await user.save()

		res.json({ message: 'Password has been reset' })
	} catch (error) {
		res.status(500).json({ message: 'Password reset failed', error })
	}
}
