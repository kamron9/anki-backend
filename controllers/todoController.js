const Todo = require('../models/Todo')

// Get all todos for a user
exports.getTodos = async (req, res) => {
	try {
		const todos = await Todo.find({ userId: req.user._id })
		res.json(todos)
	} catch (error) {
		res.status(500).json({ message: 'Failed to get todos', error })
	}
}

// Get a single todo by ID
exports.getTodoById = async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id)
		if (!todo || todo.userId.toString() !== req.user._id.toString()) {
			return res.status(404).json({ message: 'Todo not found' })
		}
		res.json(todo)
	} catch (error) {
		res.status(500).json({ message: 'Failed to get todo', error })
	}
}

// Add a new todo
exports.addTodo = async (req, res) => {
	const { title, description } = req.body
	try {
		const todo = await Todo.create({ userId: req.user._id, title, description })
		res.status(201).json(todo)
	} catch (error) {
		res.status(500).json({ message: 'Failed to add todo', error })
	}
}

// Mark a todo as completed
exports.completeTodo = async (req, res) => {
	const { id } = req.params
	try {
		const todo = await Todo.findByIdAndUpdate(
			id,
			{ isCompleted: true },
			{ new: true }
		)
		if (!todo || todo.userId.toString() !== req.user._id.toString()) {
			return res.status(404).json({ message: 'Todo not found' })
		}
		res.json(todo)
	} catch (error) {
		res.status(500).json({ message: 'Failed to mark todo as completed', error })
	}
}

// Remove a todo by ID
exports.removeTodo = async (req, res) => {
	const { id } = req.params
	try {
		const todo = await Todo.findById(id)
		if (!todo || todo.userId.toString() !== req.user._id.toString()) {
			return res.status(404).json({ message: 'Todo not found' })
		}
		await todo.remove()
		res.json({ message: 'Todo removed successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Failed to remove todo', error })
	}
}
