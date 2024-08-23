const Card = require('../models/Card')

// Get cards for a user
exports.getCards = async (req, res) => {
	try {
		const cards = await Card.find({ userId: req.user._id })
		res.json(cards)
	} catch (error) {
		res.status(500).json({ message: 'Failed to get cards', error })
	}
}

// Add a new card
exports.addCard = async (req, res) => {
	const { front, back } = req.body
	try {
		const card = await Card.create({ userId: req.user._id, front, back })
		res.status(201).json(card)
	} catch (error) {
		res.status(500).json({ message: 'Failed to add card', error })
	}
}
