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
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/todos', todoRoutes)

mongoose
	.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDBga muvaffaqiyatli ulandi'))
	.catch(error => console.error('MongoDBga ulanishda xatolik: ', error))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
