const express = require('express');
const { body } = require('express-validator');
const {
  createWorkspace, getWorkspaces, getWorkspace,
  updateWorkspace, deleteWorkspace,
  addMember, updateMemberRole, removeMember,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

const createValidators = [
  body('name').trim().notEmpty().withMessage('Workspace name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

router.post('/',       createValidators, createWorkspace);
router.get('/',        getWorkspaces);
router.get('/:id',     getWorkspace);
router.put('/:id',     updateWorkspace);
router.delete('/:id',  deleteWorkspace);

// Member management
router.post('/:id/members',                    addMember);
router.put('/:id/members/:userId/role',         updateMemberRole);
router.delete('/:id/members/:userId',           removeMember);

module.exports = router;
