/* eslint-disable no-mixed-spaces-and-tabs */
import {
	IsNotEmpty, IsString, IsNumber, IsArray,
	ValidateNested, IsDefined,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { customValidateSync } from '_/middleware/validationHandler';
import { ApplicationError } from '_/errors/applicationError';

export class Score {
  @IsNotEmpty()
	@IsNumber()
  sub_activity_id: number= -1;

  @IsNotEmpty()
	@IsNumber()
  obtained_score: number= -1;
}

export class IndividualAssessment {
  @IsNotEmpty()
	@IsNumber()
	student_id : number= -1;

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Score)
  scores: Score[] = [];
}

export class SaveIndividualAssessmentRequestDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndividualAssessment)
  individualAssessments: IndividualAssessment[] = [];

  static async validate(payload: SaveIndividualAssessmentRequestDTO) {
  	const payloadClass = plainToInstance(SaveIndividualAssessmentRequestDTO, payload);
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

export class SaveIndividualAssessmentPayload {
  student_id : number

  sub_activity_id: number

  score: number
}

export class CreateGroupRequestDTO {
  @IsNotEmpty()
	@IsString()
  title: string = '';
}

export class UpdateGroupRequestDTO {
  @IsNotEmpty()
	@IsString()
  title: string = '';
}

export class AssignGroupRequestDTO {
  @IsNotEmpty()
	@IsNumber()
  student_id: number = -1;
}

export class UnassignGroupRequestDTO {
  @IsNotEmpty()
	@IsNumber()
  student_id: number = -1;
}

export class GroupAssessment {
  @IsNotEmpty()
	@IsNumber()
  group_id: number = -1;

  @IsNotEmpty()
  @IsArray()
  scores: Score[] = [];
}

export class SaveGroupAssessmentRequestDTO {
  @IsNotEmpty()
  @IsArray()
  groupAssessments: GroupAssessment[] = [];
}
