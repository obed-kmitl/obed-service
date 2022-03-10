import _, { sum, size, round } from 'lodash';
import {
	activityService, cloService, scoreService,
} from '.';

export const getSectionReport = async (sectionId: number) => {
	const clos = await cloService.getBySection(sectionId);
	const newClos = clos;
	for (const [i, clo] of clos.entries()) {
		const activities = await activityService.getByClo(clo.clo_id);

		const newActivities = activities;
		for (const [j, activity] of activities.entries()) {
			let sumAtivityScore = 0;
			for (const subActivity of activity.sub_activities) {
				const scores = await scoreService.getBySubActivity(sectionId, subActivity.sub_activity_id);
				const averageSubAtivityScore = sum(scores) / size(scores);
				sumAtivityScore += averageSubAtivityScore;
			}

			const filterSubActivityMaxScore = activity.sub_activities.map((el) => el.max_score);
			const averageAtivityScore = sumAtivityScore / sum(filterSubActivityMaxScore);

			newActivities[j].percent = round(averageAtivityScore * 100, 2);
		}

		// NOTE: Score Criteria should not be mock up. Should be update this logic later.
		const scoreCriteria = 70;
		const isPassed = !newActivities.find((el) => el.percent < scoreCriteria);
		newClos[i].activities = newActivities;
		newClos[i].isPassed = isPassed;
	}

	return newClos;
};
