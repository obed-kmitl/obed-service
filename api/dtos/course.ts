import {
	IsNotEmpty, IsString, IsOptional, IsNumber, Length,
} from 'class-validator';

export class CreateCourseRequestDTO {
	@IsNotEmpty()
	@IsString()
	@Length(8)
	course_id : string='';

	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsOptional()
	@IsNumber()
	pre_course_id?: number= undefined;

	@IsNotEmpty()
	@IsString()
	course_name_en : string='';

	@IsNotEmpty()
	@IsString()
	course_name_th: string='';
}

export class UpdateCourseRequestDTO {
	@IsOptional()
	@IsString()
	@Length(8, 8)
	course_id? : string= undefined;

	@IsOptional()
	@Length(8, 8)
	@IsString()
	pre_course_id?: string= undefined;

	@IsOptional()
	@IsString()
	course_name_en?: string= undefined;

	@IsOptional()
	@IsString()
	course_name_th?: string= undefined;
}

export class CourseInputDTO {
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	old_course_id? : string='';

	@IsOptional()
	@IsString()
	@Length(8, 8)
	course_id? : string= undefined;

	@IsOptional()
	@IsNumber()
	pre_course_id?: number= undefined;

	@IsOptional()
	@IsString()
	course_name_en?: string= undefined;

	@IsOptional()
	@IsString()
	course_name_th?: string= undefined;
}
