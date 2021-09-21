import { authController } from '_/controllers';
import authMiddleware from '_/middleware/auth';
import express from 'express';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/adminLogin', authController.adminLogin);
router.get('/logout', authController.logout);
router.get('/getAccessToken', authController.getAccessToken);
router.put('/updatePassword', [authMiddleware.verifyToken, authMiddleware.permit('ADMIN', 'TEACHER')], authController.updatePassword);

export default router;
