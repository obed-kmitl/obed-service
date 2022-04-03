import { mapStandardRepository } from '_/repositories';
import _ from 'lodash';

export const getBySection = async (sectionId: number) => {
	const { rows: plos } = await mapStandardRepository.findPLOBySection(sectionId);
	return	_.chain(plos)
		.transform((result, each) => {
			if (result.find(
				(ele) => ele.relative_sub_std_id === each.relative_sub_std_id
           && ele.clo_id.includes(each.clo_id),
			)) {
				return result;
			}
			if (result.find(
				(ele) => ele.relative_sub_std_id === each.relative_sub_std_id,
			)) {
				const dupIndex = result.findIndex(
					(ele) => ele.relative_sub_std_id === each.relative_sub_std_id,
				);
				return result[dupIndex].clo_id.push(each.clo_id);
			}
			if (each.clo_id) {
				return result.push({ ...each, clo_id: [each.clo_id] });
			}
			return result.push({ ...each, clo_id: [] });
		})
		.value();
};
