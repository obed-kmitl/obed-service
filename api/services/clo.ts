import { cloRepository } from '_/repositories';
import _ from 'lodash';

export const getBySection = async (sectionId: number) => {
	const cloResult = await cloRepository.findAllBySection(sectionId);
	return cloResult.rows.map((el) => ({
		...el,
		main_sub_standards: el.main_sub_standards.map((mss) => `${mss.group_sub_order_number}.${mss.sub_order_number}`),
		relative_sub_standards: el.main_sub_standards.map((rss) => `${rss.group_sub_order_number}.${rss.sub_order_number}`),
	}));
};
