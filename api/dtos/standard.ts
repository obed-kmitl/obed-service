/* eslint-disable no-mixed-spaces-and-tabs */
import {
	IsNotEmpty, IsString, IsNumber, IsArray,
	ValidateNested, IsDefined, IsOptional,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { customValidateSync } from '_/middleware/validationHandler';
import { ApplicationError } from '_/errors/applicationError';

export class SubStandard {
  @IsNotEmpty()
	@IsNumber()
	order_number : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';
}

export class GroupSubStandard {
	@IsNotEmpty()
	@IsNumber()
	order_number : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubStandard)
  sub_standards: SubStandard[] = [];
}
export class Standard {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsNotEmpty()
	@IsString()
	title : string='';

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupSubStandard)
  group_sub_standards: GroupSubStandard[] = [];
}
export class CreateAllStandardsRequestDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Standard)
  standards: Standard[] = [];

  static async validate(payload: CreateAllStandardsRequestDTO) {
  	const payloadClass = plainToInstance(CreateAllStandardsRequestDTO, payload);
  	const errors = customValidateSync(payloadClass);
  	if (errors.length > 0) {
  		throw new ApplicationError({
  			type: ApplicationError.errorType.APP_OBED_SERVICE,
  			code: 'VALIDATION_ERROR',
  			message: errors[0],
  			statusCode: 400,
  			meta: {
  				context: errors[0],
  			},
  		}, {});
  	}
  }
}

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
