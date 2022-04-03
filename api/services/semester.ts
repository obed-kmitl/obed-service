import { semesterRepository } from '_/repositories';
import _ from 'lodash';

export const getSectionByCourseAndSemester = async (
	courseId: number, semesterId:number,
) => {
	const result = await semesterRepository.findSectionByCourseAndSemester(courseId, semesterId);
	return _.chain(result.rows)
		.map((each) => each.section_id)
		.value();
};

export const getSemesterAndCourseByCurriculum = async (
	curriculumId:number,
) => {
	const result = await semesterRepository.findSemesterAndCourseByCurriculum(curriculumId);
	return result.rows;
};
