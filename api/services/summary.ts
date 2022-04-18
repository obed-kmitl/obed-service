import _, {
	sum, size, round, divide, toNumber,
} from 'lodash';
import { SCORE_CRITERIA_RATIO } from '_/constants/summary';
import {
	activityService,
	cloService,
	mapStandardService,
	scoreService,
	semesterService,
	standardService,
	studentService,
} from '.';

export const getCLOSummaryBySection = async (sectionId: number) => {
	const clos = await cloService.getBySection(sectionId);

	let newClos = clos;
	for (const [i, clo] of clos.entries()) {
		const activities = await activityService.getAssignedSubActivityByClo(clo.clo_id);

		let newActivities = activities;
		for (const [j, activity] of activities.entries()) {
			let weightAverageScores: number[] = [];
			let weightMaxScores: number[] = [];
			for (const subActivity of activity.sub_activities) {
				const weightAverageScore = await scoreService.getWeightAverageScoreBySubActivity(
					subActivity.sub_activity_id,
				);
				const weightMaxScore = await scoreService.getWeightMaxScoreBySubActivity(
					subActivity.sub_activity_id,
				);

				weightAverageScores.push(weightAverageScore);
				weightMaxScores.push(weightMaxScore);
			}

			newActivities[j] = {
				...activity,
				sumWeightAverageScores: sum(weightAverageScores),
				sumWeightMaxScores: sum(weightMaxScores),
				ratio:
          sum(weightMaxScores) > 0 ? divide(sum(weightAverageScores), sum(weightMaxScores)) : 0,
				percent: sum(weightMaxScores) > 0 ? round(
					divide(sum(weightAverageScores), sum(weightMaxScores)) * 100, 2,
				) : 0,
			};
		}

		const ratios = newActivities.map((each) => each.ratio);
		const isPassed = size(ratios) > 0 ? sum(ratios) / size(ratios) : SCORE_CRITERIA_RATIO <= 0;
		newClos[i].sumCLOWeightAverageScore = sum(
			newActivities.map((each) => each.sumWeightAverageScores),
		);
		newClos[i].sumCLOWeightMaxScore = sum(newActivities.map((each) => each.sumWeightMaxScores));
		newClos[i].activities = newActivities;
		newClos[i].isPassed = isPassed;
	}

	return newClos;
};

export const getPLOSummaryBySection = async (sectionId: number) => {
	const plos = await mapStandardService.getBySection(sectionId);
	let newPlos = plos;
	for (const [i, plo] of plos.entries()) {
		if (size(plo.clo_id) > 0) {
			let newClos: {
        ratio: number;
        sumCLOWeightAverageScore: number;
        sumCLOWeightMaxScore: number;
      }[] = [];

			for (const clo of plo.clo_id) {
				const activities = await activityService.getAssignedSubActivityByClo(clo);
				let newActivities = activities;
				for (const [j, activity] of activities.entries()) {
					let weightAverageScores: number[] = [];
					let weightMaxScores: number[] = [];
					for (const subActivity of activity.sub_activities) {
						const weightAverageScore = await scoreService.getWeightAverageScoreBySubActivity(
							subActivity.sub_activity_id,
						);
						const weightMaxScore = await scoreService.getWeightMaxScoreBySubActivity(
							subActivity.sub_activity_id,
						);

						weightAverageScores.push(weightAverageScore);
						weightMaxScores.push(weightMaxScore);
					}

					newActivities[j] = {
						sumWeightAverageScores: sum(weightAverageScores),
						sumWeightMaxScores: sum(weightMaxScores),
					};
				}

				const sumCLOWeightAverageScore = sum(
					newActivities.map((each) => each.sumWeightAverageScores),
				);
				const sumCLOWeightMaxScore = sum(newActivities.map((each) => each.sumWeightMaxScores));
				newClos.push({
					ratio:
            sumCLOWeightMaxScore > 0 ? divide(sumCLOWeightAverageScore, sumCLOWeightMaxScore) : 0,
					sumCLOWeightAverageScore,
					sumCLOWeightMaxScore,
				});
			}

			newPlos[i].clos = newClos;

			const sumPLOWeightMaxScore = sum(newClos.map((each) => each.sumCLOWeightMaxScore));

			const ploRatio = sumPLOWeightMaxScore > 0 ? sum(
				newClos.map((each) => each.sumCLOWeightMaxScore * each.ratio),
			) / sumPLOWeightMaxScore : 0;
			newPlos[i].ratio = ploRatio;
			newPlos[i].percent = round(ploRatio * 100, 2);
		} else {
			newPlos[i].ratio = 0;
			newPlos[i].percent = round(0, 2);
		}
	}

	return newPlos.map((each) => ({
		relative_sub_std_id: each.relative_sub_std_id,
		order_number: each.order_number,
		title: each.title,
		ratio: each.ratio,
		percent: each.percent,
	}));
};

export const getPLOSummaryByStudentAndSection = async (sectionId: number, studentId: number) => {
	const plos = await mapStandardService.getBySection(sectionId);

	let newPlos = plos;
	for (const [i, plo] of plos.entries()) {
		if (size(plo.clo_id) > 0) {
			let newClos: {
        ratio: number;
        sumCLOWeightScore: number;
        sumCLOWeightMaxScore: number;
      }[] = [];
			for (const [j, clo] of plo.clo_id.entries()) {
				const activities = await activityService.getAssignedSubActivityByClo(clo);
				let newActivities = activities;
				for (const [k, activity] of activities.entries()) {
					let weightScores: number[] = [];
					let weightMaxScores: number[] = [];
					for (const subActivity of activity.sub_activities) {
						const weightScore = await scoreService.getWeightScoreBySubActivity(
							subActivity.sub_activity_id,
							studentId,
						);
						const weightMaxScore = await scoreService.getWeightMaxScoreBySubActivity(
							subActivity.sub_activity_id,
						);

						weightScores.push(weightScore);
						weightMaxScores.push(weightMaxScore);
					}

					newActivities[k] = {
						sumWeightScores: sum(weightScores),
						sumWeightMaxScores: sum(weightMaxScores),
					};
				}

				const sumCLOWeightScore = sum(newActivities.map((each) => each.sumWeightScores));
				const sumCLOWeightMaxScore = sum(newActivities.map((each) => each.sumWeightMaxScores));

				newClos.push({
					ratio: sumCLOWeightMaxScore > 0 ? divide(sumCLOWeightScore, sumCLOWeightMaxScore) : 0,
					sumCLOWeightScore,
					sumCLOWeightMaxScore,
				});
			}

			newPlos[i].clos = newClos;

			const sumPLOWeightMaxScore = sum(newClos.map((each) => each.sumCLOWeightMaxScore));
			const ploRatio = sumPLOWeightMaxScore > 0 ? sum(
				newClos.map((each) => each.sumCLOWeightMaxScore * each.ratio),
			) / sumPLOWeightMaxScore : 0;
			newPlos[i].ratio = ploRatio;
			newPlos[i].percent = round(ploRatio * 100, 2);
		} else {
			newPlos[i].ratio = 0;
			newPlos[i].percent = round(0, 2);
		}
	}

	return newPlos.map((each) => ({
		relative_sub_std_id: each.relative_sub_std_id,
		order_number: each.order_number,
		title: each.title,
		ratio: each.ratio,
		percent: each.percent,
	}));
};

export const getPLOSummaryByCourseAndSemester = async (courseId: number, semesterId: number) => {
	const sections = await semesterService.getSectionByCourseAndSemester(courseId, semesterId);
	let resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    sumRatio: number;
    ratio: number;
    percent: number;
  }[] = [];
	for (const sectionId of sections) {
		const plos = await getPLOSummaryBySection(sectionId);

		if (size(resultPlos) <= 0) {
			resultPlos = plos.map((each) => ({
				relative_sub_std_id: each.relative_sub_std_id,
				order_number: each.order_number,
				title: each.title,
				sumRatio: 0,
				ratio: 0,
				percent: 0,
			}));
		}
		for (const [i, plo] of plos.entries()) {
			resultPlos[i].sumRatio += plo.ratio;
		}
	}
	return resultPlos.map((each) => ({
		relative_sub_std_id: each.relative_sub_std_id,
		order_number: each.order_number,
		title: each.title,
		ratio: size(sections) > 0 ? each.sumRatio / size(sections) : 0,
		percent: size(sections) > 0 ? round((each.sumRatio / size(sections)) * 100, 2) : 0,
	}));
};

const groupingPLOResult = async (
	resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    ratio: number;
    percent: number;
  }[],
	curriculumId: number,
) => {
	const groupOrderNumbers = await standardService.getAllRelativeGroupSubStandardByCurriculum(
		curriculumId,
	);

	let newResultPlos = groupOrderNumbers.map((each) => ({
		order_number: each.order_number,
		title: each.title,
		sumRatio: 0,
		count: 0,
	}));

	for (const each of resultPlos) {
		const eachGroupOrderNumber = toNumber(each.order_number.split('.')[0]);
		const groupIndex = newResultPlos.findIndex(
			(eachResult) => eachResult.order_number === eachGroupOrderNumber,
		);

		if (groupIndex !== -1) {
			newResultPlos[groupIndex] = {
				...newResultPlos[groupIndex],
				sumRatio: newResultPlos[groupIndex].sumRatio + each.ratio,
				count: newResultPlos[groupIndex].count + 1,
			};
		}
	}

	return newResultPlos.map((each) => ({
		order_number: each.order_number,
		title: each.title,
		ratio: each.count > 0 ? each.sumRatio / each.count : 0,
		percent: each.count > 0 ? round((each.sumRatio / each.count) * 100, 2) : 0,
	}));
};

export const getPLOSummaryByCurriculum = async (curriculumId: number) => {
	const semesterAndCourses = await semesterService.getSemesterAndCourseByCurriculum(curriculumId);
	let resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    ratio: number;
    percent: number;
    sumRatio: number;
    count: number;
  }[] = [];
	for (const semesterAndCourse of semesterAndCourses) {
		const plos = await getPLOSummaryByCourseAndSemester(
			semesterAndCourse.course_id,
			semesterAndCourse.semester_id,
		);

		for (const plo of plos) {
			if (!resultPlos.find((each) => each.relative_sub_std_id === plo.relative_sub_std_id)) {
				resultPlos.push({
					...plo,
					sumRatio: 0,
					count: 0,
				});
			}

			const ploIndex = resultPlos.findIndex(
				(each) => each.relative_sub_std_id === plo.relative_sub_std_id,
			);

			if (ploIndex !== -1) {
				resultPlos[ploIndex] = {
					...resultPlos[ploIndex],
					sumRatio: resultPlos[ploIndex].sumRatio + plo.ratio,
					count: resultPlos[ploIndex].count + 1,
				};
			}
		}
	}

	return groupingPLOResult(
		resultPlos.map((each) => ({
			relative_sub_std_id: each.relative_sub_std_id,
			order_number: each.order_number,
			title: each.title,
			ratio: each.count > 0 ? each.sumRatio / each.count : 0,
			percent: each.count > 0 ? round((each.sumRatio / each.count) * 100, 2) : 0,
		})),
		curriculumId,
	);
};

export const getPLOSummaryByStudentNumberAndCurriculum = async (
	curriculumId: number,
	studentNumber: number,
) => {
	const sections = await semesterService.getSectionByCurriculumAndStudentNumber(
		curriculumId,
		studentNumber,
	);
	let resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    ratio: number;
    percent: number;
    sumRatio: number;
    count: number;
  }[] = [];
	for (const section of sections) {
		const plos = await getPLOSummaryByStudentAndSection(section.section_id, section.student_id);
		for (const plo of plos) {
			if (!resultPlos.find((each) => each.relative_sub_std_id === plo.relative_sub_std_id)) {
				resultPlos.push({
					...plo,
					sumRatio: 0,
					count: 0,
				});
			}

			const ploIndex = resultPlos.findIndex(
				(each) => each.relative_sub_std_id === plo.relative_sub_std_id,
			);
			if (ploIndex !== -1) {
				resultPlos[ploIndex] = {
					...resultPlos[ploIndex],
					sumRatio: resultPlos[ploIndex].sumRatio + plo.ratio,
					count: resultPlos[ploIndex].count + 1,
				};
			}
		}
	}

	return groupingPLOResult(
		resultPlos.map((each) => ({
			relative_sub_std_id: each.relative_sub_std_id,
			order_number: each.order_number,
			title: each.title,
			ratio: each.count > 0 ? each.sumRatio / each.count : 0,
			percent: each.count > 0 ? round((each.sumRatio / each.count) * 100, 2) : 0,
		})),
		curriculumId,
	);
};

const getSubPLOSummaryByStudentNumberAndCurriculum = async (
	curriculumId: number,
	studentNumber: number,
) => {
	const sections = await semesterService.getSectionByCurriculumAndStudentNumber(
		curriculumId,
		studentNumber,
	);
	let resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    ratio: number;
    percent: number;
    sumRatio: number;
    count: number;
  }[] = [];
	for (const section of sections) {
		const plos = await getPLOSummaryByStudentAndSection(section.section_id, section.student_id);
		for (const plo of plos) {
			if (!resultPlos.find((each) => each.relative_sub_std_id === plo.relative_sub_std_id)) {
				resultPlos.push({
					...plo,
					sumRatio: 0,
					count: 0,
				});
			}

			const ploIndex = resultPlos.findIndex(
				(each) => each.relative_sub_std_id === plo.relative_sub_std_id,
			);
			if (ploIndex !== -1) {
				resultPlos[ploIndex] = {
					...resultPlos[ploIndex],
					sumRatio: resultPlos[ploIndex].sumRatio + plo.ratio,
					count: resultPlos[ploIndex].count + 1,
				};
			}
		}
	}

	return resultPlos.map((each) => ({
		relative_sub_std_id: each.relative_sub_std_id,
		order_number: each.order_number,
		title: each.title,
		ratio: each.count > 0 ? each.sumRatio / each.count : 0,
		percent: each.count > 0 ? round((each.sumRatio / each.count) * 100, 2) : 0,
	}));
};

export const getPLOSummaryByCohortAndCurriculum = async (curriculumId: number, cohort: string) => {
	const studentNumbers = await studentService.getStudentNumberByCurriculumAndCohort(
		curriculumId,
		cohort,
	);
	let resultPlos: {
    relative_sub_std_id: number;
    order_number: string;
    title: string;
    ratio: number;
    percent: number;
    sumRatio: number;
    count: number;
  }[] = [];
	for (const studentNumber of studentNumbers) {
		const plos = await getSubPLOSummaryByStudentNumberAndCurriculum(curriculumId, studentNumber);
		for (const plo of plos) {
			if (!resultPlos.find((each) => each.relative_sub_std_id === plo.relative_sub_std_id)) {
				resultPlos.push({
					...plo,
					sumRatio: 0,
					count: 0,
				});
			}

			const ploIndex = resultPlos.findIndex(
				(each) => each.relative_sub_std_id === plo.relative_sub_std_id,
			);
			if (ploIndex !== -1) {
				resultPlos[ploIndex] = {
					...resultPlos[ploIndex],
					sumRatio: resultPlos[ploIndex].sumRatio + plo.ratio,
					count: resultPlos[ploIndex].count + 1,
				};
			}
		}
	}

	return groupingPLOResult(
		resultPlos.map((each) => ({
			relative_sub_std_id: each.relative_sub_std_id,
			order_number: each.order_number,
			title: each.title,
			ratio: each.count > 0 ? each.sumRatio / each.count : 0,
			percent: each.count > 0 ? round((each.sumRatio / each.count) * 100, 2) : 0,
		})),
		curriculumId,
	);
};
