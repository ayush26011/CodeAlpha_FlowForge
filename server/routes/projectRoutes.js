const express = require('express');
const { body } = require('express-validator');
const {
  createProject, getProjectsByWorkspace, getProject,
  updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

const createValidators = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 150 }),
  body('workspaceId').notEmpty().withMessage('workspaceId is required').isMongoId(),
  body('status').optional().isIn(['planning', 'active', 'completed', 'archived']),
];

router.post('/', createValidators, createProject);
router.get('/workspace/:workspaceId', getProjectsByWorkspace);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
