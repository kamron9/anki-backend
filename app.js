const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const cardRoutes = require('./routes/cardRoutes')
const todoRoutes = require('./routes/todoRoutes')
const config = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: 'https://anki-backend.vercel.app/' }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/todos', todoRoutes)
app.post('/api/token/refresh', (req, res) => {
	const { refreshToken } = req.body
	if (!refreshToken) return res.status(400).send('Refresh token is required')

	jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
		if (err) return res.status(403).send('Invalid refresh token')

		const accessToken = jwt.sign(
			{ userId: user.userId },
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '15m' }
		)
		res.json({ accessToken })
	})
})

mongoose
	.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDBga muvaffaqiyatli ulandi'))
	.catch(error => console.error('MongoDBga ulanishda xatolik: ', error))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
