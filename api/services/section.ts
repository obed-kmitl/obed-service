import { semesterRepository } from '_/repositories';

export const getSection = async (sectionId: number) => {
	const result = await semesterRepository.findSection(sectionId);

	return result.rows[0];
};
