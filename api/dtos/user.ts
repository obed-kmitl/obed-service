import {
	IsNotEmpty, IsString, IsOptional, IsEnum, IsDate, Length, MinLength,
} from 'class-validator';
import { RoleEnum, PrefixEnum } from '_/constants/user';

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
	@IsEnum(PrefixEnum, { each: true })
	prefix?: String= undefined;

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
	@IsEnum(RoleEnum, { each: true })
	role?: String= undefined;

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
	@IsNotEmpty()
  @Length(8, 100)
	password: String= '';

	@IsOptional()
	@IsEnum(PrefixEnum, { each: true })
	prefix?: String= undefined;

	@IsString()
	@IsNotEmpty()
	firstname: String= '';

	@IsString()
	@IsNotEmpty()
	lastname: String= '';

	@IsOptional()
	@IsEnum(RoleEnum, { each: true })
	role?: String= undefined;
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
	@Length(8, 100)
	@IsNotEmpty()
	newPassword: String= '';
}

export class ForceUpdatePasswordRequestDTO {
	@IsString()
	@Length(8, 100)
	@IsNotEmpty()
	password: String= '';
}

export class UpdateUserProfileRequestDTO {
	@IsOptional()
	@IsString()
	email?: String = undefined;

	@IsOptional()
	@IsString()
	username?: String= undefined;

	@IsOptional()
	@IsEnum(PrefixEnum, { each: true })
	prefix?: String= undefined;

	@IsOptional()
	@IsString()
	firstname?: String= undefined;

	@IsOptional()
	@IsString()
	lastname?: String= undefined;

	@IsOptional()
	@IsString()
	g_auth_code?: String= undefined
}
