type prefixType = 'Professor'|'Assistant'
type roleType = 'admin'|'teacher'

export interface UserInfoDTO {
	email: string,
	username: string,
	password: string,
	prefix: prefixType,
	firstname: string,
	lastname: string,
	role: roleType,
}

export type UserInfoArrayDTO = [
	string,
	string,
	string,
	prefixType,
	string,
	string,
	roleType
]
