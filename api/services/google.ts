import { NextFunction } from 'express';
import { classroom_v1 } from 'googleapis';
import { ApplicationError } from '_/errors/applicationError';
import { GoogleError } from '_/errors/google';
import { getStudentNumberByKmitlEmail } from '_/utils/regex';
import { toNumber } from 'lodash';

export const listStudentSubmissions = async (
	classroomInstance: classroom_v1.Classroom,
	courseId: string, courseWorkId: string, next : NextFunction,
) => {
	try {
		const { data: { studentSubmissions } } = await classroomInstance
			.courses.courseWork.studentSubmissions.list({
				courseId,
				courseWorkId,
				states: ['RETURNED'],
			}, {});

		const studentNumberWithScoreList: {
        studentNumber: string,
        score: number
      }[] = [];

		for (const student of studentSubmissions || []) {
			const userId = student.userId || undefined;
			const result = await classroomInstance.courses.students.get({
				courseId,
				userId,
			}, {});
			const studentEmail = result.data.profile?.emailAddress;
			const studentNumber = getStudentNumberByKmitlEmail(studentEmail || '');
			const score = toNumber(student.assignedGrade);

			if (!studentNumber) {
				// eslint-disable-next-line no-continue
				continue;
			}

			studentNumberWithScoreList.push({
				studentNumber,
				score,
			});
		}

		return studentNumberWithScoreList;
	} catch (err) {
		next(new ApplicationError(GoogleError.GOOGLE_CLASSROOM_API_ERROR));
	}
};
