import express from 'express';
import { authController } from '_/controllers';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/getAccessToken', authController.getAccessToken);

export default router;
