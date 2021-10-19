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
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	pre_course_id?: number= undefined;

	@IsNotEmpty()
	@IsString()
	course_name_en?: string='';

	@IsNotEmpty()
	@IsString()
	course_name_th?: string='';
}

export class CourseInputDTO {
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	course_id? : string='';

	@IsOptional()
	@IsNumber()
	pre_course_id?: number= undefined;

	@IsNotEmpty()
	@IsString()
	course_name_en?: string='';

	@IsNotEmpty()
	@IsString()
	course_name_th?: string='';
}
