import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';

const router = Router();
const sessionController = new SessionController();

router.post('/sessions', (req, res, next) => sessionController.createSession(req, res, next));
router.get('/sessions', (req, res, next) => sessionController.getAllSessions(req, res, next));
router.get('/sessions/:sessionId', (req, res, next) => sessionController.getSession(req, res, next));
router.put('/sessions/:sessionId', (req, res, next) => sessionController.updateSession(req, res, next));
router.delete('/sessions/:sessionId', (req, res, next) => sessionController.deleteSession(req, res, next));

export default router;

