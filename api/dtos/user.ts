import {
	IsNotEmpty, IsString, IsOptional, IsArray, IsEnum, IsDate,
} from 'class-validator';
import { RoleEnum, PrefixType } from '_/constant/user';

export class UserInputDTO {
	@IsOptional()
	@IsString()
	user_id?: Number = undefined;

	@IsOptional()
	@IsString()
	email?: String = undefined;

	@IsOptional()
	@IsString()
	username?: String= undefined;

	@IsOptional()
	@IsString()
	password?: String= undefined;

	@IsOptional()
	@IsString()
	prefix?: PrefixType= undefined;

	@IsOptional()
	@IsString()
	firstname?: String= undefined;

	@IsOptional()
	@IsString()
	lastname?: String= undefined;

	@IsOptional()
	@IsString()
	g_auth_code?: String= undefined;

	@IsOptional()
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	roles?: RoleEnum[]= undefined;

	@IsOptional()
	@IsDate()
	created_at?: Date= undefined;

	@IsOptional()
	@IsDate()
	updated_at?: Date= undefined;
}

export class RegisterRequestDTO {
	@IsString()
	@IsNotEmpty()
	email: String = '';

	@IsString()
	@IsNotEmpty()
	username: String= '';

	@IsOptional()
	@IsString()
	password?: String= undefined;

	@IsOptional()
	@IsString()
	prefix?: PrefixType= undefined;

	@IsString()
	@IsNotEmpty()
	firstname: String= '';

	@IsString()
	@IsNotEmpty()
	lastname: String= '';

	@IsOptional()
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	roles?: RoleEnum[]= undefined;
}

export class LoginRequestDTO {
	@IsString()
	@IsNotEmpty()
	username: String= '';

	@IsString()
	@IsNotEmpty()
	password: String= '';
}

export class UpdatePasswordRequestDTO {
	@IsString()
	@IsNotEmpty()
	oldPassword: String= '';

	@IsString()
	@IsNotEmpty()
	newPassword: String= '';
}

export class UpdateUserProfileRequestDTO {
	@IsOptional()
	@IsString()
	email?: String = undefined;

	@IsOptional()
	@IsString()
	username?: String= undefined;

	@IsOptional()
	@IsString()
	prefix?: PrefixType= undefined;

	@IsOptional()
	@IsString()
	firstname?: String= undefined;

	@IsOptional()
	@IsString()
	lastname?: String= undefined;

	@IsOptional()
	@IsString()
	g_auth_code?: String= undefined;

	@IsOptional()
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	roles?: RoleEnum[]= undefined;
}
