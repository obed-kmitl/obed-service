import {
	IsArray,
	IsNotEmpty, IsNumber,
} from 'class-validator';

export class CreateSemesterRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	year_number : number=-1;
}

export class CreateGroupSectionsRequestDTO {
	@IsNotEmpty()
	@IsNumber({}, { each: true })
	@IsArray()
	couse_id_list: number[]= [];
}
