import { reportRepository } from '_/repositories';

export const getReportBySection = async (sectionId : number) => {
	const result = await reportRepository.getReportBySection(sectionId);
	return result.rows[0];
};
