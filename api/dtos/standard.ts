import {
	IsNotEmpty, IsString, IsNumber, IsOptional,
} from 'class-validator';

export class CreateStandardRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';
}

export class CreateGroupSubStandardRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	standard_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	order_number : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';
}

export class CreateSubStandardRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	group_sub_std_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	order_number : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';
}

export class UpdateStandardRequestDTO {
	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class StandardInputDTO {
	@IsNotEmpty()
	@IsNumber()
	standard_id : number=-1;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class UpdateGroupSubStandardRequestDTO {
	@IsOptional()
	@IsNumber()
	order_number? : number=-1;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class GroupSubStandardInputDTO {
	@IsNotEmpty()
	@IsNumber()
	group_sub_std_id : number=-1;

	@IsOptional()
	@IsNumber()
	order_number? : number=-1;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class UpdateSubStandardRequestDTO {
	@IsOptional()
	@IsNumber()
	order_number? : number=-1;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}

export class SubStandardInputDTO {
	@IsNotEmpty()
	@IsNumber()
	sub_std_id : number=-1;

	@IsOptional()
	@IsNumber()
	order_number? : number=-1;

	@IsOptional()
	@IsString()
	title? : string= undefined;
}
