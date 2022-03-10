import { scoreRepository } from '_/repositories';

export const getBySubActivity = async (
	sectionId: number,
	subActivityId: number,
) => {
	const result = await scoreRepository.getBySubActivity(sectionId, subActivityId);
	return result.rows.map((el) => el.score);
};
