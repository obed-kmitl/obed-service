import { activityRepository } from '_/repositories';
import _, { sum } from 'lodash';
import {
	CreateActivityFromClassroomRequestDTO,
	CreateActivityRequestDTO, CreateSubActivityForClassroomRequestDTO,
} from '_/dtos/activity';

export const getAssignedSubActivityByClo = async (cloId: number) => {
	const result = await activityRepository.findฺAssignedSubActivityByClo(cloId);

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

export const createActivity = async (payload: CreateActivityRequestDTO) => {
	const result = await activityRepository.create(payload);
	return result.rows[0];
};

export const createSubActivity = async (payload: CreateSubActivityForClassroomRequestDTO) => {
	const result = await activityRepository.createSubActivity(payload);

	const subActivityId: number = result.rows[0].sub_activity_id;
	const cloArray: number[][] = payload.clos.map((clo) => [subActivityId, clo]);
	const createCLOResult = await activityRepository.createSubActivitiesCLO(subActivityId, cloArray);

	const sortedClos = createCLOResult.rows[0].clos.sort((
		a, b,
	) => parseFloat(a.order_number) - parseFloat(b.order_number));

	return {
		...createCLOResult.rows[0],
		clos: sortedClos,
	};
};

export const createFromClassroom = async (payload: CreateActivityFromClassroomRequestDTO) => {
	const activity = await createActivity({
		section_id: payload.section_id,
		category_id: undefined,
		title: (payload.title).substring(0, 50),
		detail: (payload.detail || '').substring(0, 350),
		type: 'INDIVIDUAL',
	});

	const subActivity = await createSubActivity({
		activity_id: activity.activity_id,
		detail: `${(payload.title).substring(0, 50)} ${payload.detail ? `: ${(payload.detail || '').substring(0, 350)}` : ''}`,
		max_score: payload.max_score,
		clos: payload.clos,
	});

	return {
		...activity,
		sub_activities: [subActivity],
	};
};
