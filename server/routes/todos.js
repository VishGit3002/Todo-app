import express from 'express';
import { body, validationResult } from 'express-validator';
import Todo from '../models/Todo.js';

const router = express.Router();

// Validation middleware
const validateTodo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('category').optional().trim(),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// @GET /api/todos - Get all todos with filter, sort, search
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};

    if (status === 'completed') filter.completed = true;
    else if (status === 'pending') filter.completed = false;

    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const todos = await Todo.find(filter).sort(sortOptions);

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
});

// @GET /api/todos/stats - Get todo statistics
router.get('/stats', async (req, res, next) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const pending = await Todo.countDocuments({ completed: false });

    const byPriority = await Todo.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const byCategory = await Todo.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const overdue = await Todo.countDocuments({
      dueDate: { $lt: new Date() },
      completed: false,
    });

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        byPriority,
        byCategory,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @GET /api/todos/:id - Get single todo
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// @POST /api/todos - Create todo
router.post('/', validateTodo, handleValidationErrors, async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// @PUT /api/todos/:id - Update todo
router.put('/:id', validateTodo, handleValidationErrors, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// @PATCH /api/todos/:id/toggle - Toggle completed status
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// @DELETE /api/todos/:id - Delete todo
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @DELETE /api/todos - Delete all completed todos
router.delete('/', async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({
      success: true,
      message: `${result.deletedCount} completed todos deleted`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
