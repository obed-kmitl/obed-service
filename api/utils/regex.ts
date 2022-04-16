import { nth } from 'lodash';

export const getStudentNumberByKmitlEmail = (email: string) => {
	const regex = new RegExp('(^$|^[0-9]{8})+@kmitl.ac.th');
	return nth(email.match(regex), 1);
};
