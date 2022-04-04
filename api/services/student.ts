import { studentRepository } from '_/repositories';
import _ from 'lodash';

export const getStudentNumberByCurriculumAndCohort = async (
	curriculumId: number, cohort: string,
) => {
	const result = await studentRepository.findStudentNumberByCurriculumAndCohort(
		curriculumId, cohort,
	);
	return _.chain(result.rows)
		.map((each) => each.student_number)
		.value();
};
