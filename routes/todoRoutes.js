const express = require('express')
const {
	getTodos,
	getTodoById,
	addTodo,
	completeTodo,
	removeTodo,
} = require('../controllers/todoController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware) // Protect all routes below

router.get('/', getTodos) // Get all todos
router.get('/:id', getTodoById) // Get a specific todo by ID
router.post('/', addTodo) // Add a new todo
router.put('/:id/complete', completeTodo) // Mark a todo as completed
router.delete('/:id', removeTodo) // Remove a todo by ID

module.exports = router
