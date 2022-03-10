import { activityRepository } from '_/repositories';
import _ from 'lodash';

export const getByClo = async (cloId: number) => {
	const result = await activityRepository.findฺSubActivityByClo(cloId);

	return _.chain(result.rows)
		.sortBy('sub_activity_id')
		.groupBy((el) => el.activity_id)
		.map((value, key) => ({
			activity_id: value[0].activity_id,
			title: value[0].activity_title,
			detail: value[0].activity_detail,
			sub_activities: value.map((el) => ({
				sub_activity_id: el.sub_activity_id,
				detail: el.detail,
				max_score: el.max_score,
			})),
		}))
		.value();
};
