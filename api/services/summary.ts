import _, {
	sum, size, round, divide,
} from 'lodash';
import { SCORE_CRITERIA_RATIO } from '_/constants/summary';
import {
	activityService, cloService, mapStandardService, scoreService, semesterService,
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
				ratio: divide(sum(weightAverageScores), sum(weightMaxScores)),
				percent: round(divide(sum(weightAverageScores), sum(weightMaxScores)) * 100, 2),
			};
		}

		const ratios = newActivities.map((each) => each.ratio);
		const isPassed = (sum(ratios) / size(ratios)) >= SCORE_CRITERIA_RATIO;
		newClos[i].sumCLOWeightAverageScore = sum(
			newActivities.map((each) => each.sumWeightAverageScores),
		);
		newClos[i].sumCLOWeightMaxScore = sum(
			newActivities.map((each) => each.sumWeightMaxScores),
		);
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
			let newClos : {
        ratio: number,
        sumCLOWeightAverageScore: number,
        sumCLOWeightMaxScore: number,
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
				const sumCLOWeightMaxScore = sum(
					newActivities.map((each) => each.sumWeightMaxScores),
				);
				newClos.push({
					ratio: divide(sumCLOWeightAverageScore, sumCLOWeightMaxScore),
					sumCLOWeightAverageScore,
					sumCLOWeightMaxScore,
				});
			}

			newPlos[i].clos = newClos;

			const sumPLOWeightMaxScore = sum(
				newClos.map((each) => each.sumCLOWeightMaxScore),
			);
			const ploRatio = sum(
				newClos.map(
					(each) => each.sumCLOWeightMaxScore * each.ratio,
				),
			) / sumPLOWeightMaxScore;
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
			let newClos : {
        ratio: number,
        sumCLOWeightScore: number,
        sumCLOWeightMaxScore: number,
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

				const sumCLOWeightScore = sum(
					newActivities.map((each) => each.sumWeightScores),
				);
				const sumCLOWeightMaxScore = sum(
					newActivities.map((each) => each.sumWeightMaxScores),
				);

				newClos.push({
					ratio: divide(sumCLOWeightScore, sumCLOWeightMaxScore),
					sumCLOWeightScore,
					sumCLOWeightMaxScore,
				});
			}

			newPlos[i].clos = newClos;

			const sumPLOWeightMaxScore = sum(
				newClos.map((each) => each.sumCLOWeightMaxScore),
			);
			const ploRatio = sum(
				newClos.map(
					(each) => each.sumCLOWeightMaxScore * each.ratio,
				),
			) / sumPLOWeightMaxScore;
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

export const getPLOSummaryByCourseAndSemester = async (
	courseId: number, semesterId:number,
) => {
	const sections = await semesterService.getSectionByCourseAndSemester(courseId, semesterId);
	let resultPlos : {
    relative_sub_std_id: number,
    order_number: string,
    title: string,
    sumRatio: number,
    ratio: number,
    percent: number,
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
		ratio: each.sumRatio / size(sections),
		percent: round((each.sumRatio / size(sections)) * 100, 2),
	}));
};

export const getPLOSummaryByCohort = async (curriculumId: number, cohort: string) => {
	console.log('yeah');
};

export const getPLOSummaryByCurriculum = async (curriculumId: number) => {
	const semesterAndCourses = await semesterService.getSemesterAndCourseByCurriculum(curriculumId);
	for (const semesterAndCourse of semesterAndCourses) {
		const result = await getPLOSummaryByCourseAndSemester(
			semesterAndCourse.course_id,
			semesterAndCourse.semester_id,
		);
		console.log(result);
	}
};

export const getPLOSummaryByStudent = async (studentId: number) => {
	console.log('yeah');
};
