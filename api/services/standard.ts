import { standardRepository } from '_/repositories';
import { chain } from 'lodash';

export const getAllRelativeGroupSubStandardByCurriculum = async (curriculumId: number) => {
	const result = await standardRepository.getAllRelativeGroupSubStandardByCurriculum(curriculumId);

	return chain(result.rows)
		.map((each) => ({
			order_number: each.order_number,
			title: each.group_sub_standards_title,
		}))
		.value();
};
