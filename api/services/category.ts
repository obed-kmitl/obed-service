import { categoryRepository } from '_/repositories';

export const getWeightBySubActivity = async (subActivityId : number) => {
	const result = await categoryRepository.findWeightBySubActivity(subActivityId);
	return result.rows[0].weight;
};

export const getTotalMaxScoreBySubActivity = async (subActivityId : number) => {
	const result = await categoryRepository.findTotalMaxScoreBySubActivity(subActivityId);
	return result.rows[0].total_max_score;
};
