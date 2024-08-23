const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1]

	if (!token)
		return res.status(401).json({ message: 'No token, authorization denied' })

	try {
		const decoded = jwt.verify(token, 'my_secret_key12345')
		req.user = await User.findById(decoded.id).select('-password')
		next()
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' })
	}
}

module.exports = authMiddleware
