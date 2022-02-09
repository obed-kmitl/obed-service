import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsArray()
  scores: Score[] = [];
}

export class SaveIndividualAssessmentRequestDTO {
  @IsNotEmpty()
  @IsArray()
  individualAssessments: IndividualAssessment[] = [];
}

export class SaveIndividualAssessmentPayload {
  student_id : number

  sub_activity_id: number

  score: number
}