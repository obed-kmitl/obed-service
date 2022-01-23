import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { categoryController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { SaveCategoryRequestDTO, CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '_/dtos/category';

const router = express.Router();

router.post('/save', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(SaveCategoryRequestDTO),
], asyncWrapper(categoryController.save));

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateCategoryRequestDTO),
], asyncWrapper(categoryController.create));

router.get('/getAllBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(categoryController.getAllBySection));

router.put('/update/:categoryId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateCategoryRequestDTO),
], asyncWrapper(categoryController.update));

router.delete('/remove/:categoryId', [verifyToken, permit('TEACHER')], asyncWrapper(categoryController.remove));

export default router;
