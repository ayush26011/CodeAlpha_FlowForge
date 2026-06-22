const express = require('express');
const { body } = require('express-validator');
const {
  createTask, getTasksByProject, getTask,
  updateTask, deleteTask, updateTaskStatus,
  assignTask, updateTaskPriority, getTasksByWorkspace,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Inject io into req for socket events
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.use(protect);

const createValidators = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 250 }),
  body('projectId').optional().isMongoId(),
  body('project').optional().isMongoId(),
  body('status').optional().isIn(['backlog', 'todo', 'inprogress', 'review', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body().custom(body => {
    if (!body.projectId && !body.project) {
      throw new Error('Project ID is required');
    }
    return true;
  })
];

router.post('/', createValidators, createTask);
router.get('/project/:projectId', getTasksByProject);
router.get('/workspace/:workspaceId', getTasksByWorkspace);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/status', updateTaskStatus);
router.put('/:id/assign', assignTask);
router.put('/:id/priority', updateTaskPriority);

module.exports = router;
