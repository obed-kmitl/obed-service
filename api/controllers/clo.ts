import { sendResponse } from '_/utils/response';
import { cloRepository, mapStandardRepository } from '_/repositories';

import { Request, Response } from 'express';

/**
 * Create Course Learning Outcome
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await cloRepository.create(req.body);

	const { clo_id: cloId } = result.rows[0];

	const { rows: [clo] } = await cloRepository.find(cloId);

	const filterDuplicateRelative = clo.relative_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const filterDuplicateMain = clo.main_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const sortRelatives = filterDuplicateRelative.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const sortMains = filterDuplicateMain.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const newCLO = {
		...clo,
		relative_sub_standards: sortRelatives,
		main_sub_standards: sortMains,
	};

	sendResponse(res, newCLO);
};

/**
 * Get CLO
 */
const get = async (req: Request, res: Response): Promise<Response> => {
	const { cloId } = req.params;

	const { rows: [clo] } = await cloRepository.find(cloId);

	const filterDuplicateRelative = clo.relative_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const filterDuplicateMain = clo.main_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const sortRelatives = filterDuplicateRelative.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const sortMains = filterDuplicateMain.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const newCLO = {
		...clo,
		relative_sub_standards: sortRelatives,
		main_sub_standards: sortMains,
	};

	sendResponse(res, newCLO);
};

/**
 * Get all CLO By Section
 */
const getAllBySection = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;

	const result = await cloRepository.findAllBySection(sectionId);

	const clos = result.rows.map((clo) => {
		const filterDuplicateRelative = clo.relative_sub_standards.filter((
			value, index, self,
		) => index === self.findIndex((t) => (
			t.sub_std_id === value.sub_std_id
		)));

		const filterDuplicateMain = clo.main_sub_standards.filter((
			value, index, self,
		) => index === self.findIndex((t) => (
			t.sub_std_id === value.sub_std_id
		)));

		const sortRelatives = filterDuplicateRelative.sort((
			ra, rb,
		) => {
			const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
			const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

			return parseFloat(concatA) - parseFloat(concatB);
		});

		const sortMains = filterDuplicateMain.sort((
			ra, rb,
		) => {
			const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
			const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

			return parseFloat(concatA) - parseFloat(concatB);
		});

		return {
			...clo,
			relative_sub_standards: sortRelatives,
			main_sub_standards: sortMains,
		};
	});

	sendResponse(res, clos);
};

/**
 * Update Course Learning Outcome
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { cloId } = req.params;

	const { relative_standards, ...cloInput } = req.body;

	await cloRepository.update(cloId, cloInput);

	const curriculumId = await cloRepository.findCurriculumByCLO(cloId);

	let mapStandards = [];
	if (relative_standards.length > 0) {
		const resultMapstandard = await mapStandardRepository.findMapStandardBySubStdId(
			relative_standards, curriculumId,
		);
		mapStandards = resultMapstandard.rows.map((row) => row.map_sub_std_id);
	}

	const relativeStandardInfo = mapStandards.map((map_sub_std_id) => ([
		cloId,
		map_sub_std_id,
	]));

	const { rows: [clo] } = await cloRepository.createCLOSubStandards(cloId, relativeStandardInfo);

	const filterDuplicateRelative = clo.relative_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const filterDuplicateMain = clo.main_sub_standards.filter((
		value, index, self,
	) => index === self.findIndex((t) => (
		t.sub_std_id === value.sub_std_id
	)));

	const sortRelatives = filterDuplicateRelative.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const sortMains = filterDuplicateMain.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	const newCLO = {
		...clo,
		relative_sub_standards: sortRelatives,
		main_sub_standards: sortMains,
	};

	sendResponse(res, newCLO);
};

/**
 * Remove CLO
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { cloId } = req.params;

	const result = await cloRepository.deleteCLO(cloId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	update,
	remove,
	getAllBySection,
	get,
};
