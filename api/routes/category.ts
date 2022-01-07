import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { categoryController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '_/dtos/category';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateCategoryRequestDTO),
], asyncWrapper(categoryController.create));

router.put('/update/:sectionId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateCategoryRequestDTO),
], asyncWrapper(categoryController.update));

export default router;
