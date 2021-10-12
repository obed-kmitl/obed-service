import {
	IsNotEmpty, IsString, IsOptional, IsNumber,
} from 'class-validator';

export class CreateCourseRequestDTO {
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
	@IsNumber()
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
	@IsNumber()
	course_id?: number=-1;

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
