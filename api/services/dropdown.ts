import { courseRepository, semesterRepository, studentRepository } from '_/repositories';
import _ from 'lodash';

export const getSemester = async (curriculumId:number) => {
	const result = await semesterRepository.findSemester(curriculumId);
	return result.rows;
};

export const getCourse = async (semesterId:number) => {
	const result = await courseRepository.findCourse(semesterId);
	return result.rows;
};

export const getStudentNumber = async (curriculumId:number) => {
	const result = await studentRepository.findStudentNumber(curriculumId);
	return result.rows;
};
