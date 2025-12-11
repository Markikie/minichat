import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

const router = Router();
const messageController = new MessageController();

router.post('/messages', (req, res, next) => messageController.sendMessage(req, res, next));
router.get('/messages', (req, res, next) => messageController.getMessages(req, res, next));
router.delete('/messages', (req, res, next) => messageController.clearMessages(req, res, next));

export default router;

