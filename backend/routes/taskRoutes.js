import express from 'express';
import { getTasks, addTask, modifyTask, removeTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', modifyTask);
router.delete('/:id', removeTask);

export default router;
