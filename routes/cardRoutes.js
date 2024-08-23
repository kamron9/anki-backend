const express = require('express')
const { getCards, addCard } = require('../controllers/cardController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware) // Protect all routes below

router.get('/', getCards)
router.post('/', addCard)

module.exports = router
