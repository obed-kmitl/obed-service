/* eslint-disable no-shadow */
export enum PrefixEnum {
	PROF_DR = 'PROF_DR',
	PROF = 'PROF',
	ASSOC_PROF_DR = 'ASSOC_PROF_DR',
	ASSOC_PROF = 'ASSOC_PROF',
	ASST_PROF_DR = 'ASST_PROF_DR',
	ASST_PROF = 'ASST_PROF',
	DR = 'DR',
	INSTRUCTOR = 'INSTRUCTOR'
}

export enum RoleEnum {
	ADMIN = 'ADMIN',
	TEACHER = 'TEACHER'
}

const isTeacher = (role) => role === RoleEnum.TEACHER;
const isAdmin = (role) => role === RoleEnum.ADMIN;
const isPermitRole = (role, permitRole) => role === permitRole;

export {
	isTeacher,
	isAdmin,
	isPermitRole,
};
