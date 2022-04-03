import { activityRepository, scoreRepository } from '_/repositories';
import { mean } from 'lodash';
import { categoryService } from '.';

export const getAverageScoreBySubActivity = async (
	subActivityId: number,
) => {
	const result = await scoreRepository.getBySubActivity(subActivityId);
	const scores = result.rows.map((each) => each.score);
	return mean(scores);
};

export const getMaxScoreBySubActivity = async (
	subActivityId: number,
) => {
	const result = await activityRepository.findSingleSubActivity(subActivityId);
	const maxScores = result.rows.map((each) => each.max_score);
	return mean(maxScores);
};

export const getWeightAverageScoreBySubActivity = async (
	 subActivityId: number,
) => {
	const averageScore = await getAverageScoreBySubActivity(subActivityId);
	const weight = await categoryService.getWeightBySubActivity(subActivityId);
	const totalMaxScore = await categoryService.getTotalMaxScoreBySubActivity(subActivityId);
	return (averageScore * weight) / totalMaxScore;
};

export const getWeightMaxScoreBySubActivity = async (
	subActivityId: number,
) => {
	const averageMaxScore = await getMaxScoreBySubActivity(subActivityId);
	const weight = await categoryService.getWeightBySubActivity(subActivityId);
	const totalMaxScore = await categoryService.getTotalMaxScoreBySubActivity(subActivityId);
	return (averageMaxScore * weight) / totalMaxScore;
};

export const getScoreBySubActivity = async (
	subActivityId: number,
	studentId: number,
) => {
	const result = await scoreRepository.getBySubActivityAndStudent(subActivityId, studentId);
	return result.rows[0].score;
};

export const getWeightScoreBySubActivity = async (
	subActivityId: number,
	studentId: number,
) => {
	const score = await getScoreBySubActivity(subActivityId, studentId);
	const weight = await categoryService.getWeightBySubActivity(subActivityId);
	const totalMaxScore = await categoryService.getTotalMaxScoreBySubActivity(subActivityId);
	return (score * weight) / totalMaxScore;
};
