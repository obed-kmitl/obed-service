import { userController } from '_/controllers';
import authMiddleware from '_/middleware/auth';

import express from 'express';

const router = express.Router();

router.get('/getProfile', [authMiddleware.verifyToken, authMiddleware.permit('TEACHER', 'TEACHER')], userController.getProfile);
router.get('/getAllUsers', [authMiddleware.verifyToken, authMiddleware.permit('ADMIN')], userController.getAllUsers);
router.put('/updateProfile', [authMiddleware.verifyToken, authMiddleware.permit('ADMIN', 'TEACHER')], userController.updateProfile);

export default router;
