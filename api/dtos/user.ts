import {
	IsDate, IsNumber, IsString, IsOptional,
} from 'class-validator';

type PrefixType = 'PROF_DR'
									|'PROF'
									|'ASSOC_PROF_DR'
									|'ASSOC_PROF'
									|'ASST_PROF_DR'
									|'ASST_PROF'
									|'DR'
									|'INSTRUCTOR'
type RoleType = 'ADMIN'|'TEACHER'

export class UserInputDTO {
	@IsOptional()
	@IsNumber()
	user_id?: Number

	@IsOptional()
	@IsString()
	email?: String

	@IsOptional()
	@IsString()
	username?: String

	@IsOptional()
	@IsString()
	password?: String

	@IsOptional()
	@IsString()
	prefix?: PrefixType

	@IsOptional()
	@IsString()
	firstname?: String

	@IsOptional()
	@IsString()
	lastname?: String

	@IsOptional()
	@IsString()
	g_auth_code?: String

	@IsOptional()
	@IsString()
	role?: RoleType[]

	@IsOptional()
	@IsDate()
	created_at?: Date

	@IsOptional()
	@IsDate()
	updated_at?: Date

	constructor(
		user: UserInputDTO,
	) {
		this.user_id = user.user_id;
		this.email = user.email;
		this.username = user.username;
		this.password = user.password;
		this.prefix = user.prefix;
		this.firstname = user.firstname;
		this.lastname = user.lastname;
		this.g_auth_code = user.g_auth_code;
		this.role = user.role;
		this.created_at = user.created_at;
		this.updated_at = user.updated_at;
	}
}
